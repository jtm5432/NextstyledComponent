// src/app/state/chartState.ts
import { atom } from 'recoil';

interface ChartProperties {
  type: string;
  otherProp: object | string;
}

export const chartInfoMapState = atom<Record<string, ChartProperties>>({
  key: 'chartInfoMapState',
  default: {
    'a': {
      type: 'line',
      otherProp: {
        startTime: '2023-01-01T11:58:00Z',
        endTime: '2023-01-01T12:00:00Z',
        actionField: 'firewall.action',
        actionValue: 'drop',
        aggField: 'firewall.dst.keyword',
        aggType: 'avg',
        aggFieldName: 'facility'
      }
    },
    'b': {
      type: 'bar',
      otherProp: {
        startTime: '2023-01-01T11:58:00Z',
        endTime: '2023-01-01T12:00:00Z',
        actionField: 'firewall.action',
        actionValue: 'drop',
        aggField: 'firewall.dst.keyword',
        aggType: 'avg',
        aggFieldName: 'facility'
      }
    },
    'c': {
      type: 'bar',
      otherProp: {
        startTime: '2023-01-01T11:58:00Z',
        endTime: '2023-01-01T12:00:00Z',
        actionField: 'firewall.action',
        actionValue: 'drop',
        aggField: 'firewall.dst.keyword',
        aggType: 'avg',
        aggFieldName: 'facility'
      }
    },
    'd': { type: 'd', otherProp: 'value3' },
    'Globe3D': { type: 'Globe3D', otherProp: 'value4' },
    'GlobeTable': { type: 'GlobeTable', otherProp: 'value5' },
    'GlobeTableSecond': { type: 'GlobeTableSecond', otherProp: 'value6' },
    'D3Chart': { type: 'D3Chart', otherProp: 'value7' },
    'honeyComb':{
        type:'honeyComb',
        otherProp:{
          
        }

    }
  },
});
