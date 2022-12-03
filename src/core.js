import React from 'react';
import { createRoot } from "react-dom/client";

import 'bootstrap';

import "./stylesheets/core.scss"

import _Main from "./Frame";
const root = createRoot(document.getElementById("root"));
const element = <_Main />;
root.render(element);
