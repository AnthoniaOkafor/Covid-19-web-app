const dataInput = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

const covid19ImpactEstimator = (data) => {
  const {
    reportedCases, periodType, timeToElapse, totalHospitalBeds
  } = data;

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;

  let duration;

  if (periodType === 'months') {
    duration = timeToElapse * 30;
  } else if (periodType === 'weeks') {
    duration = timeToElapse * 7;
  } else if (periodType === 'days') {
    duration = timeToElapse;
  }

  const estimate = {
    data,
    impact: {},
    severeImpact: {}
  };

  // challenge 1 - currentlyInfected and infectionsByRequestedTime
  const getDetails = (details, figures) => details * figures;
  const factorOfTwo = 2 ** Math.trunc(duration / 3);

  estimate.impact.currentlyInfected = getDetails(reportedCases, 10);
  estimate.severeImpact.currentlyInfected = getDetails(reportedCases, 50);

  estimate.impact.infectionsByRequestedTime = getDetails(estimate.impact.currentlyInfected, factorOfTwo);
  estimate.severeImpact.infectionsByRequestedTime = getDetails(estimate.severeImpact.currentlyInfected, factorOfTwo);


  // challenge 2 - severeCasesByRequestedTime and hospitalBedsByRequestedTime
  const p15 = 0.15;
  const findImpactSevereCases = getDetails(estimate.impact.infectionsByRequestedTime, p15);
  const findSevereImpactSevereCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, p15);
  estimate.impact.severeCasesByRequestedTime = Math.trunc(findImpactSevereCases);
  estimate.severeImpact.severeCasesByRequestedTime = Math.trunc(findSevereImpactSevereCases);

  const numAvailBeds = getDetails(totalHospitalBeds, 0.35);
  const findSevImpactHospitalBeds = numAvailBeds - estimate.severeImpact.severeCasesByRequestedTime;
  estimate.impact.hospitalBedsByRequestedTime = Math.trunc(numAvailBeds - estimate.impact.severeCasesByRequestedTime);
  estimate.severeImpact.hospitalBedsByRequestedTime = Math.trunc(findSevImpactHospitalBeds);

  // challenge 3 - casesForICUByRequestedTime, casesForVentilatorsByRequestedTime dollarsInFlight
  const findImpactICUCases = getDetails(estimate.impact.infectionsByRequestedTime, 0.05);
  const findSevImpactICUCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, 0.05);

  estimate.impact.casesForICUByRequestedTime = Math.trunc(findImpactICUCases);
  estimate.severeImpact.casesForICUByRequestedTime = Math.trunc(findSevImpactICUCases);

  const findImpactVentilatorCases = getDetails(estimate.impact.infectionsByRequestedTime, 0.02);
  const findSevereImpactVentilatorCases = getDetails(estimate.severeImpact.infectionsByRequestedTime, 0.02);

  estimate.impact.casesForVentilatorsByRequestedTime = Math.trunc(findImpactVentilatorCases);
  estimate.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(findSevereImpactVentilatorCases);

  const avgDailyIncome = getDetails(avgDailyIncomeInUSD, avgDailyIncomePopulation);
  const findImpactInDollars = getDetails(estimate.impact.infectionsByRequestedTime, avgDailyIncome);
  const findSevImpactInDollars = getDetails(estimate.severeImpact.infectionsByRequestedTime, avgDailyIncome);


  estimate.impact.dollarsInFlight = Math.trunc((findImpactInDollars) / duration);
  estimate.severeImpact.dollarsInFlight = Math.trunc((findSevImpactInDollars) / duration);

  return {
    estimate
  };
};

console.log(covid19ImpactEstimator(dataInput));
//export default covid19ImpactEstimator;
