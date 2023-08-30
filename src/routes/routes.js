import * as dataController from "./../controllers/dataController.js";

export default (app) => {
  app.get("/get-info/:id", dataController.getInfo);
}