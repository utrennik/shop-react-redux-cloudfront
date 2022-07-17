import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import { AUTHORIZATION_TOKEN_NAME } from '../../../../../constants/names';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string;
  title: string;
};

const getAuthorizationToken = () => {
  const token = window.localStorage.getItem(AUTHORIZATION_TOKEN_NAME);
  return token ? `Basic ${token}` : '';
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
    try {
      // Get the presigned URL
      console.log('File to upload: ', file.name);
      console.log('URL: ', url);
      const authorizationToken = getAuthorizationToken();
      console.log('Authorization token: ', authorizationToken);
      const response = await axios({
        method: 'GET',
        url,
        params: {
          fileName: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: authorizationToken,
        },
      });
      console.log('Uploading to: ', response.data);
      const result = await fetch(response.data, {
        method: 'PUT',
        body: file,
      });
      console.log('Result: ', result);
      setFile('');
    } catch (e) {
      console.warn(`Error while uploading file: ${e?.data?.message}`);
    }
  };
  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
