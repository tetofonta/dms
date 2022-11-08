import { Controller, Get, Param } from '@nestjs/common';
import { PluginService } from './plugin.service';

@Controller("/plugins")
export class PluginController{

  constructor(private readonly pluginService: PluginService){}

  @Get("/:family")
  async get_plugins_by_family(
    @Param("family") family
  ){
    return this.pluginService.getFrontendPluginByFamily(family)
  }


}