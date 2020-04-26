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

  const impact = {};

  const severeImpact = {};


  // challenge 1 - currentlyInfected and infectionsByRequestedTime
  const getDetails = (details, figures) => details * figures;
  const factorOfTwo = 2 ** Math.trunc(duration / 3);

  impact.currentlyInfected = getDetails(reportedCases, 10);
  severeImpact.currentlyInfected = getDetails(reportedCases, 50);

  impact.infectionsByRequestedTime = getDetails(impact.currentlyInfected, factorOfTwo);
  severeImpact.infectionsByRequestedTime = getDetails(severeImpact.currentlyInfected, factorOfTwo);


  // challenge 2 - severeCasesByRequestedTime and hospitalBedsByRequestedTime
  const p15 = 0.15;
  const findImpactSevereCases = getDetails(impact.infectionsByRequestedTime, p15);
  const findSevereImpactSevereCases = getDetails(severeImpact.infectionsByRequestedTime, p15);
  impact.severeCasesByRequestedTime = Math.trunc(findImpactSevereCases);
  severeImpact.severeCasesByRequestedTime = Math.trunc(findSevereImpactSevereCases);

  const numAvailBeds = getDetails(totalHospitalBeds, 0.35);
  const findSevImpactHospitalBeds = numAvailBeds - severeImpact.severeCasesByRequestedTime;
  impact.hospitalBedsByRequestedTime = Math.trunc(numAvailBeds - impact.severeCasesByRequestedTime);
  severeImpact.hospitalBedsByRequestedTime = Math.trunc(findSevImpactHospitalBeds);

  // challenge 3 - casesForICUByRequestedTime, casesForVentilatorsByRequestedTime dollarsInFlight
  const findImpactICUCases = getDetails(impact.infectionsByRequestedTime, 0.05);
  const findSevImpactICUCases = getDetails(severeImpact.infectionsByRequestedTime, 0.05);

  impact.casesForICUByRequestedTime = Math.trunc(findImpactICUCases);
  severeImpact.casesForICUByRequestedTime = Math.trunc(findSevImpactICUCases);

  const findImpactVentilatorCases = getDetails(impact.infectionsByRequestedTime, 0.02);
  const findSevereImpactVentilatorCases = getDetails(severeImpact.infectionsByRequestedTime, 0.02);

  impact.casesForVentilatorsByRequestedTime = Math.trunc(findImpactVentilatorCases);
  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(findSevereImpactVentilatorCases);

  const avgDailyIncome = getDetails(avgDailyIncomeInUSD, avgDailyIncomePopulation);
  const findImpactInDollars = getDetails(impact.infectionsByRequestedTime, avgDailyIncome);
  const findSevImpactInDollars = getDetails(severeImpact.infectionsByRequestedTime, avgDailyIncome);


  impact.dollarsInFlight = Math.trunc((findImpactInDollars) / duration);
  severeImpact.dollarsInFlight = Math.trunc((findSevImpactInDollars) / duration);

  return {
    data,
    impact,
    severeImpact
  };
};

covid19ImpactEstimator(dataInput);
export default covid19ImpactEstimator;
