// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportPc from '../../../app/controller/pc';

declare module 'egg' {
  interface IController {
    pc: ExportPc;
  }
}
