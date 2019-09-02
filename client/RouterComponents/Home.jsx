import React from 'react'
import moment from 'moment'
import { Row, Col } from 'antd/lib'
import Loader from '../UIComponents/Loader'
import PublicActivityThumb from '../UIComponents/PublicActivityThumb'

const yesterday = moment(new Date()).add(-1, 'days')

const getFirstFutureOccurence = occurence =>
  moment(occurence.endDate).isAfter(yesterday)

const compareForSort = (a, b) => {
  const firstOccurenceA = a.datesAndTimes.find(getFirstFutureOccurence)
  const firstOccurenceB = b.datesAndTimes.find(getFirstFutureOccurence)
  const dateA = new Date(
    firstOccurenceA.startDate + 'T' + firstOccurenceA.startTime + ':00Z'
  )
  const dateB = new Date(
    firstOccurenceB.startDate + 'T' + firstOccurenceB.startTime + ':00Z'
  )
  return dateA - dateB
}

class Home extends React.Component {
  state = {
    isUploading: false
  }

  getPublicActivities = () => {
    const { bookingsList } = this.props
    if (!bookingsList) {
      return null
    }

    const publicActivities = bookingsList.filter(
      activity => activity.isPublicActivity === true
    )

    const futurePublicActivities = publicActivities.filter(activity =>
      activity.datesAndTimes.some(date =>
        moment(date.endDate).isAfter(yesterday)
      )
    )

    return futurePublicActivities
  }

  getGroupMeetings = () => {
    const { groupsList } = this.props
    if (!groupsList) {
      return null
    }

    const futureGroups = groupsList.filter(group =>
      group.meetings.some(meeting =>
        moment(meeting.startDate).isAfter(yesterday)
      )
    )

    return futureGroups.map(group => ({
      ...group,
      datesAndTimes: group.meetings,
      isGroup: true
    }))
  }

  getAllSorted = () => {
    const allActitivities = [
      ...this.getPublicActivities(),
      ...this.getGroupMeetings()
    ]
    return allActitivities.sort(compareForSort)
  }

  render () {
    const { isLoading } = this.props

    const allSortedActivities = this.getAllSorted()

    return (
      <div style={{ padding: 24, width: '100%' }}>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row>
              <Col sm={0} md={6} />
              <Col sm={24} md={12} style={{ paddingBottom: 24 }}>
                <p>
                  Club Anthropocene is a meetingplace and testing-ground for
                  visual and textual conceptualization of ideas relating to the
                  theme ”anthropocene”.
                </p>

                <p>
                  This could include meetings between art, philosophy, religion,
                  the natural sciences and the humanities, or meetings between
                  different traditions of knowledge.
                </p>

                <p>
                  The meeting place in itself is open for everyone that wants to
                  participate and contribute to it. Its ambition is to provide
                  space for thinking together, foregrounding the necessity of
                  testing and developing ideas collectively and as individuals
                  participating in a collective process. In this process queer,
                  multicultural and post human perspectives are encouraged.
                </p>
              </Col>
              <Col sm={0} md={6} />
            </Row>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {allSortedActivities.map(activity => (
                <PublicActivityThumb key={activity.title} item={activity} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Home
