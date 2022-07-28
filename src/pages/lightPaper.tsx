import React from "react";
import { Mixpanel } from './../mixpanel'

const LightPaper = () => {
  Mixpanel.events.pageOpened("Light Paper", '');
  return (
    <div>
      <h1>LightPaper</h1>
      <h1>LightPaper</h1>
      <h1>LightPaper</h1>
      <h1>LightPaper</h1>
      <h1>LightPaper</h1>
    </div>
  );
};

export default LightPaper;
