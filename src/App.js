import React from "react";
import { Grid } from "@material-ui/core";
import Header from "./Components/Header";
import Features from "./Components/Features";
import NotionList from "./NotionList";

const WorkSpace = () => {
  return (
    <div>
      <Header />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <NotionList />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Features />
        </Grid>
      </Grid>
    </div>
  );
};



export default WorkSpace;
