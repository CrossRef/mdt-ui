import React from 'react'
import is from 'prop-types'


 class BulkUpdateResultModal extends React.Component {

  static propTypes = {    
    msg: is.string.isRequired,
    uploadedFile: is.string

  }
  render () {
    
    return (       
       <div className="bulkUpdateContainer">
      <div className="content">
      This may take some time to process, you will be notified when update is completed.
        {this.props.msg}
      <div className="file">
        <div className="fileName">{this.props.uploadedFile}</div>
        </div>
        </div>
      </div>
      )
  }
 }export default BulkUpdateResultModal