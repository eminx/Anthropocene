import React from 'react';
import { Row, Col, Spin, Button, Icon, Divider, Checkbox, List, Avatar, Affix, message } from 'antd/lib';
import Blaze from 'meteor/gadicc:blaze-react-component';
import CardArticle from '../UIComponents/CardArticle';
const ListItem = List.Item;

class Gathering extends React.Component {
  state= {
    isAttending: false
  }

  componentDidUpdate(prevProps, prevState) {
    const { isLoading, currentUser } = this.props;
    if (prevProps.isLoading && !isLoading && currentUser) {
      this.setIsAttending();
    } else if (currentUser && currentUser.attending && prevProps.currentUser && prevProps.currentUser.attending) {
      if (currentUser.attending.length !== prevProps.currentUser.attending.length) {
        this.setIsAttending();
      }
    } else if (!prevProps.currentUser && currentUser) {
      this.setIsAttending();
    }
  }

  checkIfAttending = () => {
    const { gatheringData, currentUser } = this.props;
    let isAttending = false;
    if (currentUser.attending && gatheringData) {
      for (let event of currentUser.attending) {
        if (event.gatheringId === gatheringData._id) {
          isAttending = true;
        }
      }
    }
    return isAttending;
  }

  setIsAttending = () => {
    const isAttending = this.checkIfAttending();
    this.setState({
      isAttending: isAttending
    });
  }

  signupComing = () => {
    const { isAttending } = this.state;
    const { gatheringData } = this.props;
    if (!isAttending && gatheringData) {
      Meteor.call('registerAttendance', gatheringData._id, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.success("You're successfully registered!");
        }
      });
    } else {
      message.error("You've already signed up!");
    }
  }

  signupNotComing = () => {
    const { isAttending } = this.state;
    const { gatheringData } = this.props;
    if (isAttending && gatheringData) {
      const gatheringId = gatheringData._id;
      Meteor.call('unRegisterAttendance', gatheringId, (err, res) => {
        if (err) {
          message.error("It didn't work :/");
          console.log(err);
        } else {
          message.info("Sad that you aren't coming, but thanks for letting us know!");
        }
      });
    } else {
      message.error("OK! We get that you won't come");
    }
  }

  toggleAttendance = (userId, e) => {
    const { gatheringData } = this.props;
    e.preventDefault();
    Meteor.call('toggleAttendanceAsHost', gatheringData._id, userId, (err, res) => {
      if (err) {
        message.error("It didn't work :/");
        console.log(err);
      } else {
        console.log('fixed');
      }
    });
  }

  getManageButtons = () => {
    const { currentUser } = this.props;
    const { isAttending } = this.state;

    const isMyEventWTF = this.isMyEvent();

    const rsvpButtonGroupForUser = 
      <Button.Group>
        <Button type={isAttending ? 'default' : 'primary'} onClick={this.signupNotComing}>
          <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle' } />I'm not coming
        </Button>
        <Button type={isAttending ? 'primary' : 'default'} onClick={this.signupComing}>
          <Icon type={isAttending ? 'heart' : 'heart-o' } />I'm coming!
        </Button>
      </Button.Group>;

    const rsvpButtonGroupForNonUser = 
      <div>
        <Button.Group>
          <Button type={isAttending ? 'default' : 'primary'} disabled>
            <Icon type={isAttending ? 'minus-circle-o' : 'minus-circle' } />I'm not coming
          </Button>
          <Button type={isAttending ? 'primary' : 'default'} disabled>
            <Icon type={isAttending ? 'heart' : 'heart-o' } />I'm coming!
          </Button>
        </Button.Group>
        <Divider />
        <p style={{cursor: 'default'}}>You have to sign in to RSVP</p>
        <Blaze template="loginButtons" >
          <Button>
            <Icon type="login" />
          </Button>
        </Blaze>
      </div>

    // const hostActions =
    //   <div>
    //     <h4 style={{color: 'rgba(0, 0, 0, .55)'}}>You're the host of this activity</h4>
    //     <Button.Group>
    //       <Button disabled>
    //         <Icon type="edit" />Edit this post
    //       </Button>
    //       <Button disabled>
    //         <Icon type="delete"/>Delete this post
    //       </Button>
    //     </Button.Group>
    //   </div>;

    let manageButtons;
    if (currentUser) {
      manageButtons = rsvpButtonGroupForUser;
    } else {
      manageButtons = rsvpButtonGroupForNonUser;
    }

    return manageButtons;
  }

  adminApprovalButtons = () => {
    const { currentUser, gatheringData } = this.props;
    const confirm = () => {
      Meteor.call('publishGathering', gatheringData._id, (err, res) => {
        if (err) {
          message.error("Sorry didn't happen for some reason :/")
        } else {
          message.success("The activity is successfully published.");
        }
      });
    }
    if (currentUser && currentUser.isSuperAdmin && gatheringData && !gatheringData.isPublished) {
      return (
        <div style={{marginTop: 30}}>
          <p>This event is not published.</p>
          <Popconfirm 
            title="Are you sure" onConfirm={confirm} okText="Yes" cancelText="No">
            <Button
              type="primary" 
              onClick={() => Meteor.call('publishGathering', gatheringData._id)}
            >
              Publish
            </Button>
          </Popconfirm>
        </div>
      )
    }
  }

  isMyEvent = () => {
    const { gatheringData, currentUser } = this.props;
    if (currentUser && gatheringData) {
      return gatheringData.authorId === currentUser._id
    }
  }

  render() {

    const { gatheringData, isLoading, currentUser } = this.props;
    const { isAttending } = this.state;
    const isMyEventWTF = this.isMyEvent();

    const manageButtons = this.getManageButtons();

    return (
    	<div>
    		<Row gutter={24}>
    			<Col sm={24} md={16}>
            {!isLoading && gatheringData
              ? <CardArticle 
                  item={gatheringData}
                  isLoading={isLoading}
                  isAttending={isAttending}
                  isMyEventWTF={isMyEventWTF}
                  currentUser={currentUser}
                />
              : <div style={{display: 'flex', justifyContent: 'center'}}>
                  <Spin size="large" />
                </div>
            }
    			</Col>
    			<Col sm={24} md={8}>
            {this.adminApprovalButtons()}

            { isMyEventWTF 
              ?
                gatheringData.attendees.length > 0 
                  ?
                    <div style={{padding: 12}}>
                      <h3>Attendees</h3>
                      <p>Please uncheck for those who did not attend</p>
                      <List bordered itemLayout="horizontal" size="small">
                        {gatheringData.attendees.map((attendee, i) => (
                          <ListItem key={attendee.userId + i}>
                            <List.Item.Meta
                              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                              title={<span className={!attendee.didNotAttend ? 'bold-font' : ''}>{attendee.userId}</span>}
                            />
                            <Checkbox checked={!attendee.didNotAttend} onChange={this.toggleAttendance.bind(this, attendee.userId)} />
                          </ListItem>
                        ))}
                      </List>
                    </div>
                  : <p>Currently no one registered. Keep spreading the word!</p>
              : manageButtons
            }
            
          </Col>
    		</Row>
      </div>
    )
  }
}

export default Gathering;