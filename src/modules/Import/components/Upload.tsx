import React, { FC, ChangeEvent, useState, useContext } from "react";
import { Button, Paper, Typography, Grid } from "@material-ui/core";
import { CloudUpload, Check } from "@material-ui/icons";
import Papa from "papaparse";
import { parseISO } from "date-fns";

import { StorageContext, Workout } from "../../../contexts/Storage";

const Upload: FC = () => {
  const { setWorkouts } = useContext(StorageContext);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      setUploading(true);
      Papa.parse(event.target.files[0], {
        complete(results) {
          if (results.errors.length === 0) {
            const dataCopy = results.data.filter(el => el.length === 12); // filter out garbage data (empty lines etc.)
            dataCopy.shift(); // first row is headers
            const workouts = dataCopy.map(
              (workout): Workout => ({
                date: parseISO(workout[0]),
                exercise: workout[2],
                weight: workout[4],
                weightUnit: workout[5],
                reps: workout[6],
                distance: workout[7],
                distanceUnit: workout[8],
                seconds: workout[9]
              })
            );
            setWorkouts(workouts);
            setUploading(false);
            setSuccess(true);
          }
        }
      });
    }
  };

  return (
    <Paper>
      <Grid container direction="column">
        <Grid item>
          <Typography>
            Upload your exported CSV file from the Strong app
          </Typography>
        </Grid>
        <Grid>
          <label htmlFor="button-file">
            <input
              accept=".csv"
              style={{ display: "none" }}
              id="button-file"
              type="file"
              onChange={onChange}
            />
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={uploading}
              startIcon={success ? <Check /> : <CloudUpload />}
            >
              Upload
            </Button>
          </label>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Upload;
