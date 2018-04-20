import React from 'react';
import { Row, Col, Spin, Button, Icon, Divider, Checkbox, List, Avatar, Affix, Popconfirm, message } from 'antd/lib';
import CardArticle from '../UIComponents/CardArticle';
const ListItem = List.Item;

class Gathering extends React.Component {

  checkIfAttending = () => {
    const { gatheringData, currentUser } = this.props;
    let isAttending = false;
    if (currentUser && currentUser.attending && gatheringData) {
      for (let event of currentUser.attending) {
        if (event.gatheringId === gatheringData._id) {
          isAttending = true;
        }
      }
    }
    return isAttending;
  }

  signupComing = () => {
    const isAttending = this.checkIfAttending();
    const { gatheringData } = this.props;
    if (!isAttending && gatheringData) {
      Meteor.call('registerAttendance', gatheringData._id, (err, res) => {
        if (err) {
          message.error(err.reason);
        } else {
          message.success("You're successfully registered!");
        }
      });
    } else {
      message.error("You've already signed up!");
    }
  }

  signupNotComing = () => {
    const isAttending = this.checkIfAttending();
    const { gatheringData } = this.props;
    if (isAttending && gatheringData) {
      const gatheringId = gatheringData._id;
      Meteor.call('unRegisterAttendance', gatheringId, (err, res) => {
        if (err) {
          message.error(err.reason);
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
        message.error(err.reason);
      }
    });
  }

  getManageButtons = () => {
    const { currentUser, gatheringData } = this.props;
    const isAttending = this.checkIfAttending();

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
    if (currentUser && currentUser.isSuperAdmin && gatheringData && !gatheringData.isPublished) {
      manageButtons = this.adminApprovalButtons();
    } else if (currentUser) {
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
          message.error(err.reason)
        } else {
          message.success("The activity is successfully published.");
        }
      });
    }

    return (
      <div style={{marginTop: 30}}>
        <p>This event is not published.</p>
        <Popconfirm 
          title="Are you sure" onConfirm={confirm} okText="Yes" cancelText="No">
          <Button
            type="primary" 
          >
            Publish
          </Button>
        </Popconfirm>
      </div>
    )
  }

  isMyEvent = () => {
    const { gatheringData, currentUser } = this.props;
    if (currentUser && gatheringData) {
      return gatheringData.authorId === currentUser._id
    }
  }

  render() {
    const { gatheringData, isLoading, currentUser } = this.props;
    const isAttending = this.checkIfAttending();
    const isMyEventWTF = this.isMyEvent();

    const manageButtons = this.getManageButtons();

    return (
    	<div>
    		<Row gutter={24}>
          <Col sm={24} md={16}>
            {
              !isLoading && gatheringData
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

    			
    		</Row>
      </div>
    )
  }
}

export default Gathering;