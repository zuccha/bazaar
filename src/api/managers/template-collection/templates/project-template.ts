import { R, ResultVoid } from "../../../utils/result";
import { ManagerBag } from "../../manager";
import Project from "../../project";
import { ResourceBag } from "../../resource";
import Template from "../template";

export default class ProjectTemplate extends Template<Project> {
  protected id = "ProjectTemplate";

  private _resourceBag: ResourceBag;
  protected resource: Project;

  constructor(
    directoryPath: string,
    managerBag: ManagerBag,
    resourceBag: ResourceBag,
  ) {
    super(managerBag);

    this._resourceBag = resourceBag;
    this.resource = new Project(directoryPath, managerBag, resourceBag);
  }

  async createFromBaserom(params: {
    baseromPath: string;
    authors?: string[];
    version?: string;
  }): Promise<ResultVoid> {
    return this.resource.createFromBaserom(params);
  }

  async createFromProject(projectDirectoryPath: string): Promise<ResultVoid> {
    const project = new Project(
      projectDirectoryPath,
      this.managerBag,
      this._resourceBag,
    );

    const result = await this.createFromResource(project);
    if (R.isError(result)) {
      return result;
    }

    return R.Void;
  }

  async initProject(params: {
    directoryPath: string;
    name: string;
    authors?: string[];
    version?: string;
  }): Promise<ResultVoid> {
    const project = new Project(
      this.fs.join(params.directoryPath, params.name),
      this.managerBag,
      this._resourceBag,
    );

    const result = await this.initResource(project);
    if (R.isError(result)) {
      return result;
    }

    // TODO: Update config.

    return R.Void;
  }
}
