import { Result } from "../../utils/result";
import Collection, { CollectionErrorCodes } from "../collection";
import Directory from "../directory";
import { ResourceBag } from "../resource";
import ProjectTemplate from "./templates/project-template";

class ProjectTemplateCollection extends Collection<
  ProjectTemplate,
  ResourceBag
> {
  protected id = "ProjectTemplateCollection";

  protected init(directoryPath: string, bag: ResourceBag): ProjectTemplate {
    return new ProjectTemplate(directoryPath, bag);
  }
}

export type TemplateInfo = {
  name: string;
};

export type TemplateCollectionErrorCodes = {
  ListProjects: CollectionErrorCodes["List"];
};

export default class TemplateCollection extends Directory<ResourceBag> {
  protected id = "TemplateCollection";

  private _projects: ProjectTemplateCollection;

  constructor(directoryPath: string, bag: ResourceBag) {
    super(directoryPath, bag);

    const projectsDirectoryPath = this.path("Projects");
    this._projects = new ProjectTemplateCollection(projectsDirectoryPath, bag);
  }

  async listProjects(): Promise<
    Result<TemplateInfo[], TemplateCollectionErrorCodes["ListProjects"]>
  > {
    return this._projects.list();
  }

  project(name: string): ProjectTemplate {
    return this._projects.get(name);
  }
}
