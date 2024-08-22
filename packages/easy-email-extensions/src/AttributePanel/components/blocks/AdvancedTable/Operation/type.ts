import { ITableData } from '@core/blocks/advanced/generateAdvancedTableBlock';

export interface IOperationData extends ITableData {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface IBoundaryRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface IBoundingPosition {
  left: number;
  top: number;
  right: number;
  bottom: number;
}