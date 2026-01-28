import "../css/style.css";
import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.js";

loadHeaderFooter();

new Alert().init();
