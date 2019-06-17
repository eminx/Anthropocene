import { withTracker } from 'meteor/react-meteor-data'
import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'

import {
  Layout,
  Divider,
  Button,
  Icon,
  Form,
  Input,
  Badge,
  Popover,
  List,
  Row,
  Col
} from 'antd/lib'
const { Content } = Layout

const menu = [
  {
    label: 'Program',
    route: '/'
  },
  {
    label: 'Calendar',
    route: '/calendar'
  },
  {
    label: 'Streams',
    route: '/streams'
  },
  {
    label: 'Info',
    route: '/page/about-wertschafft'
  }
]

const adminMenu = [
  {
    label: 'Users',
    route: '/users'
  }
]

const FormItem = Form.Item

class LayoutPage extends React.Component {
  state = {
    menuOpen: false,
    me: false,
    isNotificationPopoverOpen: false
  }

  componentWillUpdate (nextProps, nextState) {
    const { history } = this.props
    const pathname = history.location.pathname
    if (nextProps.history.location.pathname !== pathname) {
      this.closeMenu()
    }
  }

  openMenu = () => {
    this.setState({
      menuOpen: true
    })
  }

  closeMenu = () => {
    this.setState({
      menuOpen: false
    })
  }

  handleNotificationVisibility = () => {
    this.setState({
      isNotificationPopoverOpen: !this.state.isNotificationPopoverOpen
    })
  }

  renderNotificationList = list => {
    if (list.length === 0) {
      return <em>You don't have unread messages</em>
    }

    return (
      <List
        size='small'
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Link
              to={`/${item.context}/${item.contextId}`}
              onClick={this.handleNotificationVisibility}
            >
              <Badge count={item.count} offset={[10, 0]}>
                <h4>{item.title}</h4>
              </Badge>
            </Link>
          </List.Item>
        )}
      />
    )
  }

  render () {
    const { isNotificationPopoverOpen } = this.state
    const { children, currentUser } = this.props

    const notifications = currentUser && currentUser.notifications
    let notificationsCounter = 0
    if (notifications && notifications.length > 0) {
      notifications.forEach(notification => {
        notificationsCounter += notification.count
      })
    }

    const menuIconStyle = {
      fontSize: 24,
      padding: '18px 12px',
      cursor: 'pointer',
      marginLeft: 18
    }

    return (
      <div className='main-viewport'>
        <div className='header-container'>
          <Row className='header-background'>
            <Col xs={8}>
              <span
                style={{
                  padding: '6px 12px',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  backgroundColor: 'rgba(255, 255, 255, .7)'
                }}
              >
                <Link to='/my-profile' style={{ color: '#030303' }}>
                  {currentUser ? currentUser.username : 'LOGIN'}
                </Link>
              </span>
            </Col>

            <Col xs={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to='/'>
                {/* <div className="logo skogen-logo" /> */}
                <h1>
                  <b>WERTSCHAFFT</b>
                </h1>
              </Link>
            </Col>

            <Col xs={8} style={{ textAlign: 'right' }}>
              {notifications && (
                <Popover
                  placement='bottomRight'
                  title='Notifications'
                  content={this.renderNotificationList(notifications)}
                  trigger='click'
                  visible={isNotificationPopoverOpen}
                  onVisibleChange={this.handleNotificationVisibility}
                >
                  <Badge count={notificationsCounter}>
                    <Icon
                      onClick={this.toggleNotificationsPopover}
                      theme='outlined'
                      type='bell'
                      style={{ fontSize: 24, cursor: 'pointer' }}
                    />
                  </Badge>
                </Popover>
              )}
            </Col>
          </Row>
        </div>

        <div className='skogen-menu-layout'>
          {menu.map(item => (
            <Link to={item.route} key={item.label}>
              <b>{item.label}</b>
            </Link>
          ))}
          {currentUser &&
            currentUser.isSuperAdmin &&
            adminMenu.map(item => (
              <Link to={item.route} key={item.label}>
                <b>{item.label}</b>
              </Link>
            ))}
        </div>

        <Layout className='layout'>
          <Content>{children}</Content>
        </Layout>

        <FancyFooter />
      </div>
    )
  }
}

const widgetBgrstyle = {
  textAlign: 'center',
  backgroundColor: 'rgba(255, 234, 241, .8)',
  padding: 24,
  margin: 12,
  marginTop: 32,
  maxWidth: 320
}

const boldBabe = {
  textTransform: 'uppercase',
  fontWeight: 700
}

const FancyFooter = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}
    >
      <div style={widgetBgrstyle}>
        {/* <EmailSignupForm />
          <Divider style={{ background: '#030303' }} />
        */}

        <WertschafftInfo />

        <Divider style={{ background: '#030303' }} />
        {/*
        <h4>Swish for donations:</h4>
        <h3 style={{ ...boldBabe }}>123 388 4772</h3> */}

        <p style={{ marginTop: 24 }}>
          Crafted with ∞♥︎ at{' '}
          <a href='https://infinitesimals.space'>Infinitesimals Labs</a>
        </p>
        {/* <p>
          <a
            href="https://github.com/eminx/SkogenApp"
            style={{ borderBottom: '1px solid #ea3214e6' }}
          >
            source code
          </a>
        </p> */}

        <p>
          We're yet to build a newsletter. Please stay around and visit us to
          keep updated.
        </p>
      </div>
    </div>
  )
}

const EmailSignupForm = () => (
  <Fragment>
    <FormItem>
      <h4 style={{ ...boldBabe, marginBottom: 0, lineHeight: '10px' }}>
        Sign up to Our Newsletter
      </h4>
    </FormItem>
    <form method='POST' action='https://gansub.com/s/RKNO/'>
      <FormItem>
        <Input addonBefore='email' id='email' name='email' />
      </FormItem>

      <FormItem>
        <Input addonBefore='first name' id='first_name' name='first_name' />
      </FormItem>

      <input type='hidden' name='gan_repeat_email' />

      <FormItem>
        <Button htmlType='submit'>Signup</Button>
      </FormItem>
    </form>
  </Fragment>
)

const WertschafftInfo = () => (
  <Fragment>
    <h3 style={boldBabe}>Wertschafft</h3>
    <p>Lenaustraße 20, 12047 Berlin</p>
    <p>
      <a href='mailto:info@radicow.com'>info@radicow.com</a>
    </p>
    {/* <p>
      <a href='https://www.facebook.com/skogen.pm' target='_blank'>
        www.facebook.com/skogen.pm
      </a>
      <br />
      (opens in a new tab)
    </p> */}
  </Fragment>
)

export default (LayoutContainer = withTracker(props => {
  const meSub = Meteor.subscribe('me')
  const currentUser = Meteor.user()

  return {
    currentUser
  }
})(LayoutPage))
