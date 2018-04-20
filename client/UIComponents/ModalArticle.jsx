import React from 'react';
import { Modal, Card, Icon, Avatar, Spin } from 'antd/lib';
const { Meta } = Card;

const getInitials = (string) => {
  var names = string.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();
  
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }
  return initials;
};

class ModalArticle extends React.Component {
	
  render() {
    const { isLoading, item } = this.props;

    return (
      <Modal
        {...this.props} style={{top: 20}} > 
        {
          isLoading 
          ?
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <Spin size="large" />
            </div>
          :
            <Card
              title={<div><h1>{item.title}</h1></div>}
              bordered={false}
            >
              <Meta
                avatar={<Avatar>{getInitials(item.authorName)}</Avatar>}
                title={`${item.room}, Noden`}
                description={item.longDescription}
              />
            </Card>
        }
      </Modal>
    )
  }
}

export default ModalArticle;