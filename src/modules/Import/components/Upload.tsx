import React, { FC, ChangeEvent, useState } from "react";
import { Button } from "@material-ui/core";
import Papa from "papaparse";

const Upload: FC = () => {
  const [data, setData] = useState();
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      Papa.parse(event.target.files[0], {
        complete(results) {
          setData(results.data);
        }
      });
    }
  };

  console.log(data);

  return (
    <label htmlFor="button-file">
      <input
        style={{ display: "none" }}
        id="button-file"
        type="file"
        onChange={onChange}
      />
      <Button variant="contained" component="span">
        Upload
      </Button>
    </label>
  );
};

export default Upload;
