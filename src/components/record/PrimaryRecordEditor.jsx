import React, { PropTypes } from 'react';

export default function PrimaryRecordEditor(props) {
  return (
    <div>
      <RecordEditorContainer
        cloneCsid={cloneCsid}
        config={config}
        csid={csid}
        recordType={recordType}
        vocabulary={vocabulary}
        showSidebar
        clone={this.cloneRecord}
        onRecordCreated={this.handleRecordCreated}
      />
      <RecordSideBar
        csid={csid}
        recordType={recordType}
        vocabulary={vocabulary}
        config={config}
      />
    </div>
  );
}

