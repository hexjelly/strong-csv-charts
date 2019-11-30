import React, { FC, useContext, useMemo, useState, ChangeEvent } from "react";
import {
  Paper,
  Typography,
  Grid,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Collapse,
  TextField
} from "@material-ui/core";
import { FilterList, ExpandMore } from "@material-ui/icons";
import { format } from "date-fns";

import { StorageContext } from "../../../contexts/Storage";

interface PR {
  volume?: {
    total: number;
    weight: number;
    reps: number;
  };
  weight?: number;
  oneRepMax?: number;
  pace?: number;
  distance?: number;
  duration?: number;
  date: Date;
}

interface PRList {
  [key: string]: PR;
}

interface Filter {
  name: string;
  showVolume: boolean;
  showWeight: boolean;
  showOneRM: boolean;
}

const PRList: FC = () => {
  const { workouts } = useContext(StorageContext);
  const [filter, setFilter] = useState<Filter>({
    name: "",
    showVolume: true,
    showOneRM: true,
    showWeight: true
  });
  const [search, setSearch] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearch(event.target.value);
  };

  const handleChange = (field: string) => (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    event.persist(); // we're using callback in our useState so we need to stop the synthetic event from being nullified
    setFilter({ ...filter, [field]: event.target.checked });
  };

  // calculate PRs
  // TODO: move this to another context probably?
  const workoutPRs = useMemo<PRList>(() => {
    /* eslint-disable no-param-reassign */ // thanks eslint you sure are smart
    return workouts.reduce<PRList>((prList, workout) => {
      if (prList[workout.exercise]) {
        // if there already is an entry for this exercise
        // check if we beat the previous "weight" PRs
        if (workout.weightUnit && workout.weight && workout.reps) {
          // check max weight PR
          if (
            prList[workout.exercise].weight &&
            prList[workout.exercise].weight! < workout.weight
          ) {
            prList[workout.exercise].weight = workout.weight;
          }
          // check volume PR
          if (
            prList[workout.exercise].volume &&
            prList[workout.exercise].volume!.total <
              workout.weight * workout.reps
          ) {
            prList[workout.exercise].volume = {
              total: workout.weight * workout.reps,
              weight: workout.weight,
              reps: workout.reps
            };
          }
          // check 1RM
          if (
            prList[workout.exercise].oneRepMax &&
            prList[workout.exercise].oneRepMax! <
              Math.floor(workout.weight * (36 / (37 - workout.reps)))
          ) {
            prList[workout.exercise].oneRepMax = Math.floor(
              workout.weight * (36 / (37 - workout.reps))
            );
          }
        }
      } else {
        // there are no entries for the exercise yet, set the PRs
        prList[workout.exercise] = {
          date: workout.date,
          weight: workout.weight,
          ...(workout.weight &&
            workout.reps && {
              volume: {
                total: workout.weight * workout.reps,
                weight: workout.weight,
                reps: workout.reps
              }
            }),
          oneRepMax:
            workout.weight &&
            workout.reps &&
            Math.floor(workout.weight * (36 / (37 - workout.reps)))
        };
      }
      return prList;
    }, {});
    /* eslint-enable no-param-reassign */
  }, [workouts]);

  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel-content"
          id="panel-header"
        >
          <FilterList style={{ marginRight: "0.5em" }} />
          <Typography>Filter</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container direction="column">
            <Grid item>
              <TextField
                label="Exercise name"
                value={search}
                onChange={handleSearch}
                color="secondary"
              />
            </Grid>
            <Grid item>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter.showWeight}
                      onChange={handleChange("showWeight")}
                      value="showWeight"
                      color="secondary"
                    />
                  }
                  label="Weight"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter.showVolume}
                      onChange={handleChange("showVolume")}
                      value="showVolume"
                      color="secondary"
                    />
                  }
                  label="Volume"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filter.showOneRM}
                      onChange={handleChange("showOneRM")}
                      value="showOneRM"
                      color="secondary"
                    />
                  }
                  label="1RM"
                />
              </FormGroup>
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {Object.entries(workoutPRs)
        .filter(([workout]) =>
          workout.toLowerCase().includes(search.toLowerCase())
        )
        .map(([workout, prs]) => (
          <Paper key={workout}>
            <Typography variant="h2" color="secondary">
              {workout}
            </Typography>
            <Grid container>
              <Grid item>
                <Collapse in={filter.showWeight}>
                  <Grid container>
                    <Grid item xs={8} sm={4}>
                      <Typography>
                        Weight: {`${prs.weight} `}
                        <Typography component="span" color="textSecondary">
                          kg
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Typography color="textSecondary" align="right">
                        {format(prs.date, "dd MMM yyyy")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
              <Grid item>
                <Collapse in={filter.showVolume}>
                  <Grid container>
                    <Grid item xs={8} sm={4}>
                      <Typography>
                        Vol: {`${prs.volume && prs.volume.total} `}
                        <Typography component="span" color="textSecondary">
                          kg
                        </Typography>
                        <Typography component="span" color="textSecondary">
                          {` (${prs.volume &&
                            `${prs.volume.weight}kg x ${prs.volume.reps}`})`}
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Typography color="textSecondary" align="right">
                        {format(prs.date, "dd MMM yyyy")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
              <Grid item>
                <Collapse in={filter.showOneRM}>
                  <Grid container>
                    <Grid item xs={8} sm={4}>
                      <Typography>
                        1RM: {`${prs.oneRepMax} `}
                        <Typography component="span" color="textSecondary">
                          kg
                        </Typography>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sm={2}>
                      <Typography color="textSecondary" align="right">
                        {format(prs.date, "dd MMM yyyy")}
                      </Typography>
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          </Paper>
        ))}
    </>
  );
};

export default PRList;
