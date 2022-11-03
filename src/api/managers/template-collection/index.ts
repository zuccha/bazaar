import DirectoryManager from "../directory-manager";
import { ManagerBag } from "../manager";
import { ResourceBag } from "../resource";
import ProjectTemplate from "./templates/project-template";

export default class TemplateCollection extends DirectoryManager {
  protected id = "TemplateCollection";

  private _managerBag: ManagerBag;
  private _resourceBag: ResourceBag;

  constructor(
    directoryPath: string,
    managerBag: ManagerBag,
    resourceBag: ResourceBag,
  ) {
    super(directoryPath, managerBag);

    this._managerBag = managerBag;
    this._resourceBag = resourceBag;
  }

  project(name: string): ProjectTemplate {
    return new ProjectTemplate(
      this.path("Project", name),
      this._managerBag,
      this._resourceBag,
    );
  }
}
