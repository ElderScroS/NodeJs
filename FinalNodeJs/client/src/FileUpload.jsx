import React from 'react';

const FileUpload = ({
  handleFileUpload,
  handleMediaUpload,
  inputFile,
  inputFileMedia,
  startRecording,
  stopRecording,
  isRecording
}) => {
  return (
    <div className='file-upload'>
      <button onClick={() => inputFile.current && inputFile.current.click()}>
      </button>
      <input
        type='file'
        style={{ display: 'none' }}
        ref={inputFile}
        onChange={handleFileUpload}
      />
      <button onClick={() => inputFileMedia.current && inputFileMedia.current.click()}>
      </button>
      <input
        type='file'
        style={{ display: 'none' }}
        ref={inputFileMedia}
        onChange={handleMediaUpload}
        multiple
      />
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Record Audio'}
      </button>
    </div>
  );
};

export default FileUpload;
