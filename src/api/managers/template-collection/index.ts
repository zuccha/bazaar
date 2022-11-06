import { Result } from "../../utils/result";
import Collection, { CollectionErrorCodes } from "../collection";
import Directory from "../directory";
import { ResourceContext } from "../resource";
import ProjectTemplate from "./templates/project-template";

class ProjectTemplateCollection extends Collection<
  ProjectTemplate,
  ResourceContext
> {
  protected id = "ProjectTemplateCollection";

  protected init(
    directoryPath: string,
    context: ResourceContext,
  ): ProjectTemplate {
    return new ProjectTemplate(directoryPath, context);
  }
}

export type TemplateInfo = {
  name: string;
};

export type TemplateCollectionErrorCodes = {
  ListProjects: CollectionErrorCodes["List"];
};

export default class TemplateCollection extends Directory<ResourceContext> {
  protected id = "TemplateCollection";

  private _projects: ProjectTemplateCollection;

  constructor(directoryPath: string, context: ResourceContext) {
    super(directoryPath, context);

    const projectsDirectoryPath = this.path("Projects");
    this._projects = new ProjectTemplateCollection(
      projectsDirectoryPath,
      context,
    );
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
