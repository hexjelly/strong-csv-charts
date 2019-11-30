import React, { FC, useContext, useMemo, useState } from "react";
import { Paper, Typography, Grid } from "@material-ui/core";
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
      {Object.entries(workoutPRs).map(([workout, prs]) => (
        <Paper key={workout}>
          <Typography variant="h2" color="secondary">
            {workout}
          </Typography>
          <Grid container>
            <Grid container item>
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
            <Grid container item>
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
            <Grid container item>
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
          </Grid>
        </Paper>
      ))}
    </>
  );
};

export default PRList;
