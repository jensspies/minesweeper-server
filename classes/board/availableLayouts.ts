import { FullBeginner } from './layouts/fullBeginner';
import { FullAdvanced } from './layouts/fullAdvanced';
import { FullExpert } from './layouts/fullExpert';

const fullBeginner = new FullBeginner();
const fullBeginnerTechnical = fullBeginner.getTechnicalName();
const fullAdvanced = new FullAdvanced();
const fullAdvancedTechnical = fullAdvanced.getTechnicalName();
const fullExpert = new FullExpert();
const fullExpertTechnical = fullExpert.getTechnicalName();


export const availableLayouts: any =  {};
availableLayouts[fullBeginnerTechnical] = fullBeginner;
availableLayouts[fullAdvancedTechnical] = fullAdvanced;
availableLayouts[fullExpertTechnical] = fullExpert;


