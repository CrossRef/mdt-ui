import React from 'react'
import is from 'prop-types'
import { routes } from '../../routing'

class BulkUpdateResultModal extends React.Component {

  static propTypes = {
    msg: is.string.isRequired,
    uploadedFile: is.string

  }
  render() {
    return (
      <div className="bulkUpdateContainer" >
        <div className="content">
          This may take some time to process, you will be notified when update is completed.
        {this.props.msg}
          <div className="vertspacer" />
          <div className="file">
            <div className="fileName">{this.props.uploadedFile}</div>
            <div className="imgHolder">
              <img className="check" alt="Successful File" src={`${routes.images}/BulkUpload/Asset_Icons_Teal_Check 3.svg`} />
            </div>
          </div>
        </div>
        <div className="height32"></div>
        <div className="buttons">

          <div className="close" onClick={this.props.close}>Close</div>
        </div>

      </div>

    )
  }
} export default BulkUpdateResultModal