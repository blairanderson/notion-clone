import React from "react";
import { Grid } from "@material-ui/core";
import Header from "./Components/Header";
import Features from "./Components/Features";
import NotionList from "./NotionList";

export default function App(props) {
  return (
    <div>
      <Header />
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <NotionList {...props} />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Features />
        </Grid>
      </Grid>
    </div>
  );
}
