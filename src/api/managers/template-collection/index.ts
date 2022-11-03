import Directory from "../directory";
import { ResourceBag } from "../resource";
import ProjectTemplate from "./templates/project-template";

export default class TemplateCollection extends Directory {
  protected id = "TemplateCollection";

  private _bag: ResourceBag;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(directoryPath, bag);
    this._bag = bag;
  }

  project(name: string): ProjectTemplate {
    return new ProjectTemplate(this.path("Projects", name), this._bag);
  }
}
