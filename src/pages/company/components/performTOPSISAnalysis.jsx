function performTOPSISAnalysis(employees, departmentsData) {
    // TOPSIS Step 1: Normalize Decision Matrix
    function normalizeDecisionMatrix(data) {
        // Calculate normalized values using Euclidean normalization
        const criteria = [
            { name: 'workExperience', weight: 0.3 },
            { name: 'performanceRating', weight: 0.3 },
            { name: 'skillLevel', weight: 0.2 },
            { name: 'trainingCost', weight: 0.2 }
        ];

        // Compute squared sum for each criterion
        const squaredSums = criteria.map(criterion => 
            Math.sqrt(data.reduce((sum, emp) => sum + Math.pow(emp[criterion.name], 2), 0))
        );

        // Normalize matrix
        return data.map(employee => {
            const normalizedEmployee = { ...employee };
            
            criteria.forEach((criterion, index) => {
                // Euclidean normalization: x_ij / sqrt(sum of squared values)
                normalizedEmployee[`${criterion.name}Normalized`] = 
                    employee[criterion.name] / squaredSums[index];
            });

            return normalizedEmployee;
        });
    }

    // TOPSIS Step 2: Weighted Normalized Decision Matrix
    function weightedNormalizedMatrix(normalizedData) {
        const criteria = [
            { name: 'workExperience', weight: 0.3, type: 'benefit' },
            { name: 'performanceRating', weight: 0.3, type: 'benefit' },
            { name: 'skillLevel', weight: 0.2, type: 'benefit' },
            { name: 'trainingCost', weight: 0.2, type: 'cost' }
        ];

        return normalizedData.map(employee => {
            const weightedEmployee = { ...employee };
            
            criteria.forEach(criterion => {
                // Multiply normalized value by weight
                const normalizedValue = employee[`${criterion.name}Normalized`];
                weightedEmployee[`${criterion.name}Weighted`] = normalizedValue * criterion.weight;
            });

            return weightedEmployee;
        });
    }

    // TOPSIS Step 3: Determine Ideal Solutions
    function determineIdealSolutions(weightedData) {
        const criteria = [
            { name: 'workExperienceWeighted', type: 'benefit' },
            { name: 'performanceRatingWeighted', type: 'benefit' },
            { name: 'skillLevelWeighted', type: 'benefit' },
            { name: 'trainingCostWeighted', type: 'cost' }
        ];

        // Positive Ideal Solution (PIS): Max for benefit, Min for cost
        const positiveIdeal = criteria.map(criterion => 
            criterion.type === 'benefit' 
                ? Math.max(...weightedData.map(e => e[criterion.name]))
                : Math.min(...weightedData.map(e => e[criterion.name]))
        );

        // Negative Ideal Solution (NIS): Min for benefit, Max for cost
        const negativeIdeal = criteria.map(criterion => 
            criterion.type === 'benefit'
                ? Math.min(...weightedData.map(e => e[criterion.name]))
                : Math.max(...weightedData.map(e => e[criterion.name]))
        );

        return { positiveIdeal, negativeIdeal };
    }

    // TOPSIS Step 4: Calculate Separation Measures
    function calculateSeparationMeasures(weightedData, idealSolutions) {
        const { positiveIdeal, negativeIdeal } = idealSolutions;
        const criteria = [
            'workExperienceWeighted',
            'performanceRatingWeighted', 
            'skillLevelWeighted', 
            'trainingCostWeighted'
        ];

        return weightedData.map(employee => {
            // Calculate Euclidean distance to Positive Ideal Solution
            const positiveDistance = Math.sqrt(
                criteria.reduce((sum, criterion, index) => 
                    sum + Math.pow(employee[criterion] - positiveIdeal[index], 2), 
                0)
            );

            // Calculate Euclidean distance to Negative Ideal Solution
            const negativeDistance = Math.sqrt(
                criteria.reduce((sum, criterion, index) => 
                    sum + Math.pow(employee[criterion] - negativeIdeal[index], 2), 
                0)
            );

            return {
                ...employee,
                positiveDistance,
                negativeDistance
            };
        });
    }

    // TOPSIS Step 5: Calculate Relative Closeness
    function calculateRelativeCloseness(separationData) {
        return separationData.map(employee => {
            // Relative Closeness Coefficient
            const closenessCoefficient = 
                employee.negativeDistance / (employee.positiveDistance + employee.negativeDistance);

            return {
                ...employee,
                topisisScore: closenessCoefficient
            };
        }).sort((a, b) => b.topisisScore - a.topisisScore);
    }

    // Main TOPSIS Execution Pipeline
    const normalizedData = normalizeDecisionMatrix(employees);
    const weightedData = weightedNormalizedMatrix(normalizedData);
    const idealSolutions = determineIdealSolutions(weightedData);
    const separationData = calculateSeparationMeasures(weightedData, idealSolutions);
    const rankedEmployees = calculateRelativeCloseness(separationData);

    return rankedEmployees.slice(0, 10); // Return top 10 employees
}

export default performTOPSISAnalysis;