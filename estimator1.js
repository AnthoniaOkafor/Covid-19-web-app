//const estimateButton = document.getElementById("data-go-estimate");

const covid19ImpactEstimator = () => {
//estimateButton.onclick = (e) => {
  //e.preventDefault();

const impCurInfected = document.getElementById('data-impCurInfected');
const sevCurInfected = document.getElementById('data-sevCurInfected');
const impInfections = document.getElementById('data-impInfections');
const sevInfections = document.getElementById('data-sevInfections');
const impSevereCases = document.getElementById('data-impSevereCases');
const sevSevereCases = document.getElementById('data-sevSevereCases');
const impHospitalBeds = document.getElementById('data-impHospitalBeds');                           
const sevHospitalBeds = document.getElementById('data-sevHospitalBeds');
const impICU = document.getElementById('data-impICU');
const sevICU = document.getElementById('data-sevICU');
const impVentilator =document.getElementById('data-impVentilator');
const sevVentilator = document.getElementById('data-sevVentilator');
const impDollarsInFlight =document.getElementById('data-impDollarsInFlight');
const sevDollarsInFlight = document.getElementById('data-sevDollarsInFlight');

const regionName = document.getElementById("data-region-name");
const population = document.getElementById("data-population");
const avgAge = document.getElementById("data-region-avgAge");
const avgDailyInc = document.getElementById("data-region-avgDailyIncome");
const avgDailyIncPopulation = document.getElementById("data-region-avgDailyIncPopulation");
const repCases = document.getElementById("data-reported-cases");
const hospitalBeds = document.getElementById("data-total-hospital-beds");
const time2Elapse = document.getElementById("data-time-to-elapse");
const prdType = document.getElementById("data-period-type");

const reportedCases = repCases.value;
const periodType = prdType.value;
const timeToElapse = time2Elapse.value;
const totalHospitalBeds= hospitalBeds.value;
const avgDailyIncomeInUSD = avgDailyInc.value;
const avgDailyIncomePopulation = avgDailyIncPopulation.value;

  let duration;

  if (periodType === 'months') {
    duration = timeToElapse * 30;
  } else if (periodType === 'weeks') {
    duration = timeToElapse * 7;
  } else if (periodType === 'days') {
    duration = timeToElapse;
  }


  const estimate = {
    impact: {},
    severeImpact: {}
  };

  // challenge 1 - currentlyInfected and infectionsByRequestedTime
  const getDetails = (details, figures) => details * figures;
  const factorOfTwo = 2 ** Math.trunc(duration / 3);

  estimate.impact.currentlyInfected = getDetails(reportedCases, 10);
  estimate.severeImpact.currentlyInfected = getDetails(reportedCases, 50);

  impCurInfected.value = estimate.impact.currentlyInfected;
  sevCurInfected.value = estimate.severeImpact.currentlyInfected;
  
  estimate.impact.infectionsByRequestedTime = getDetails(estimate.impact.currentlyInfected, factorOfTwo);
  estimate.severeImpact.infectionsByRequestedTime = getDetails(estimate.severeImpact.currentlyInfected, factorOfTwo);

  impInfections.value = estimate.impact.infectionsByRequestedTime;
  sevInfections.value = estimate.severeImpact.infectionsByRequestedTime;


  // challenge 2 - severeCasesByRequestedTime and hospitalBedsByRequestedTime
  const p15 = 0.15;
  const findImpactSevereCases = getDetails(estimate.impact.infectionsByRequestedTime, p15);
  const findSevereImpactSevereCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, p15);
  estimate.impact.severeCasesByRequestedTime = Math.trunc(findImpactSevereCases);
  estimate.severeImpact.severeCasesByRequestedTime = Math.trunc(findSevereImpactSevereCases);

  impSevereCases.value = estimate.impact.severeCasesByRequestedTime;
  sevSevereCases.value = estimate.severeImpact.severeCasesByRequestedTime;

  const numAvailBeds = getDetails(totalHospitalBeds, 0.35);
  const findSevImpactHospitalBeds = numAvailBeds - estimate.severeImpact.severeCasesByRequestedTime;
  estimate.impact.hospitalBedsByRequestedTime = Math.trunc(numAvailBeds - estimate.impact.severeCasesByRequestedTime);
  estimate.severeImpact.hospitalBedsByRequestedTime = Math.trunc(findSevImpactHospitalBeds);

  impHospitalBeds.value = estimate.impact.hospitalBedsByRequestedTime;
  sevHospitalBeds.value = estimate.severeImpact.hospitalBedsByRequestedTime;

  // challenge 3 - casesForICUByRequestedTime, casesForVentilatorsByRequestedTime dollarsInFlight
  const findImpactICUCases = getDetails(estimate.impact.infectionsByRequestedTime, 0.05);
  const findSevImpactICUCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, 0.05);

  estimate.impact.casesForICUByRequestedTime = Math.trunc(findImpactICUCases);
  estimate.severeImpact.casesForICUByRequestedTime = Math.trunc(findSevImpactICUCases);
  
  impICU.value = estimate.impact.casesForICUByRequestedTime;
  sevICU.value = estimate.severeImpact.casesForICUByRequestedTime;

  const findImpactVentilatorCases = getDetails(estimate.impact.infectionsByRequestedTime, 0.02);
  const findSevereImpactVentilatorCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, 0.02);

  estimate.impact.casesForVentilatorsByRequestedTime = Math.trunc(findImpactVentilatorCases);
  estimate.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(findSevereImpactVentilatorCases);

  impVentilator.value = estimate.impact.casesForVentilatorsByRequestedTime;
  sevVentilator.value = estimate.severeImpact.casesForVentilatorsByRequestedTime;

  const avgDailyIncome = getDetails(avgDailyIncomeInUSD, avgDailyIncomePopulation);
  const findImpactInDollars = getDetails(estimate.impact.infectionsByRequestedTime, avgDailyIncome);
  const findSevImpactInDollars = getDetails(estimate.severeImpact.infectionsByRequestedTime, avgDailyIncome);

  estimate.impact.dollarsInFlight = Math.trunc((findImpactInDollars) / duration);
  estimate.severeImpact.dollarsInFlight = Math.trunc((findSevImpactInDollars) / duration);

  impDollarsInFlight.value = estimate.impact.dollarsInFlight;
  sevDollarsInFlight.value = estimate.severeImpact.dollarsInFlight;

  
};
//console.log(covid19ImpactEstimator());
