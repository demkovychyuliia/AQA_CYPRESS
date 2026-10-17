function generateCarData(fixtureData) {
  const carIndex = Math.floor(
    Math.random() * fixtureData.cars.length
  );

  const car = fixtureData.cars[carIndex];

  const initialMileage =
    100 + Math.floor(Math.random() * 1000);

  return {
    ...car,
    initialMileage,
    expenseMileage: initialMileage + 1,
    fuelLiters: fixtureData.fuelLiters,
    fuelTotalCost: fixtureData.fuelTotalCost,
    carName: `${car.brand} ${car.model}`,
  };
}

module.exports = { generateCarData };