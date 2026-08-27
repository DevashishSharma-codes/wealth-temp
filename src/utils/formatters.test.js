import { calculateCorpus, calculateReadinessScore, buildCalcPayload, getActualChildName, formatGoalTitle, stripSalutation } from './formatters';

describe('formatters - new-wealth-fe', () => {
  describe('calculateCorpus', () => {
    test('should calculate correct corpus when values are provided', () => {
      const formData = {
        yearsUntilRetirement: '25',
        requiredAnnualIncome: '1500000',
      };
      // (1,500,000 * 20) / 10,000,000 = 3.0
      expect(calculateCorpus(formData)).toBe(3);
    });

    test('should return default fallback value of 4.2 when form data is empty', () => {
      expect(calculateCorpus({})).toBe(4.2);
    });

    test('should clamp the corpus to a minimum of 1.2', () => {
      const formData = {
        yearsUntilRetirement: '30',
        requiredAnnualIncome: '200000', // (200,000 * 20) / 10,000,000 = 0.4
      };
      expect(calculateCorpus(formData)).toBe(1.2);
    });
  });

  describe('calculateReadinessScore', () => {
    test('should calculate readiness score correctly based on total savings', () => {
      const formData = {
        epfTotalCorpus: '1000000',
        npsTotalCorpus: '1000000',
        superTotalCorpus: '500000',
      }; // total = 2.5M. score = (2.5M / 5M) * 100 = 50
      expect(calculateReadinessScore(formData)).toBe(50);
    });

    test('should cap readiness score at 100', () => {
      const formData = {
        epfTotalCorpus: '4000000',
        npsTotalCorpus: '2000000',
        superTotalCorpus: '0',
      }; // total = 6M. score capped at 100
      expect(calculateReadinessScore(formData)).toBe(100);
    });

    test('should default to 72 if score calculation is 0', () => {
      expect(calculateReadinessScore({})).toBe(72);
    });
  });

  describe('buildCalcPayload', () => {
    test('should construct correct payload without a spouse', () => {
      const formData = {
        requiredAnnualIncome: '1000000',
        epfEmployerShare: '5000',
        epfEmployeeShare: '5000',
        npsEmployerShare: '2000',
        npsEmployeeShare: '2000',
        superEmployerShare: '1000',
        epfTotalCorpus: '500000',
        npsTotalCorpus: '300000',
        superTotalCorpus: '200000',
        monthlyExpense: '40000',
      };

      const expected = {
        client_epf_annual: 5000 + 5000,
        client_epf_accum: 500000,
        client_annual_ret_reqd: 1000000,
        household_monthly: 40000,
        employer_nps_pm: 2000,
        self_nps_pm: 2000,
        current_nps_accum: 300000,
        sa_pm: 1000,
        current_sa_accum: 200000,
      };

      expect(buildCalcPayload(formData)).toEqual(expect.objectContaining(expected));
    });

    test('should construct correct payload with a spouse', () => {
      const formData = {
        spouseName: 'Jane Doe',
        requiredAnnualIncome: '1000000',
        epfEmployerShare: '5000',
        epfEmployeeShare: '5000',
        epfTotalCorpus: '500000',
        monthlyExpense: '40000',
      };

      const expected = {
        client_epf_annual: 5000 + 5000,
        client_epf_accum: 500000,
        client_annual_ret_reqd: 1000000,
        household_monthly: 40000,
      };

      expect(buildCalcPayload(formData)).toEqual(expect.objectContaining(expected));
    });

    test('should return empty object when all retirement fields are missing', () => {
      const payload = buildCalcPayload({});
      expect(payload).toEqual({});
    });

    test('should return payload containing only user entered fields without forcing 0 fallbacks', () => {
      const payload = buildCalcPayload({ requiredAnnualIncome: '1000000' });
      expect(payload.client_annual_ret_reqd).toBe(1000000);
      expect(payload.household_monthly).toBeUndefined();
      expect(payload.spouse_epf_annual).toBeUndefined();
    });
  });

  describe('formatGoalTitle & getActualChildName', () => {
    test('should change Graduation / Education to Higher Studies for child goals with custom child name', () => {
      const goal = { category: 'child_goal', goal_type: 'Graduation', child_number: 1 };
      const childrenData = [{ name: 'Aarav' }];
      expect(formatGoalTitle(goal, childrenData)).toBe("Aarav's Higher Studies");
    });

    test('should format child marriage goal with child name', () => {
      const goal = { category: 'child_goal', goal_type: 'Marriage', child_number: 1 };
      const childrenData = [{ name: 'Aarav' }];
      expect(formatGoalTitle(goal, childrenData)).toBe("Aarav's Marriage");
    });

    test('should format generic Child 1 when child name is not explicitly set', () => {
      const goal = { category: 'child_goal', goal_type: 'Graduation', child_number: 1 };
      expect(formatGoalTitle(goal, [])).toBe("Child 1's Higher Studies");
    });

    test('should format non-child Graduation goal to Higher Studies without child name', () => {
      const goal = { category: 'lifestyle', goal_type: 'Graduation' };
      expect(formatGoalTitle(goal, [])).toBe("Higher Studies");
    });

    test('should assign distinct respective names to goals of multiple children', () => {
      const childrenData = [{ name: 'Aarav' }, { name: 'Priya' }];
      const goal1 = { category: 'child_goal', goal_type: 'Graduation', child_number: 1 };
      const goal2 = { category: 'child_goal', goal_type: 'Marriage', child_number: 2 };
      const allGoals = [goal1, goal2];

      expect(formatGoalTitle(goal1, childrenData, allGoals)).toBe("Aarav's Higher Studies");
      expect(formatGoalTitle(goal2, childrenData, allGoals)).toBe("Priya's Marriage");
    });

    test('should resolve real child name when goal is a raw backend string containing Child 1 / Child 2', () => {
      const childrenData = [{ name: 'Aarav' }, { name: 'Priya' }];
      expect(formatGoalTitle("Child 1's Higher Education", childrenData)).toBe("Aarav's Higher Studies");
      expect(formatGoalTitle("Child 2's Marriage", childrenData)).toBe("Priya's Marriage");
      expect(formatGoalTitle("Child 1 - Education", childrenData)).toBe("Aarav's Higher Studies");
    });

    test('should resolve real child name when goal object contains generic goal property string', () => {
      const childrenData = [{ name: 'Aarav' }, { name: 'Priya' }];
      const row1 = { goal: "Child 1's Higher Education", target_year: 2035 };
      const row2 = { goal: "Child 2's Marriage", target_year: 2040 };
      expect(formatGoalTitle(row1, childrenData)).toBe("Aarav's Higher Studies");
      expect(formatGoalTitle(row2, childrenData)).toBe("Priya's Marriage");
    });

    test('should NEVER attach child name to lifestyle goals like Foreign Tour, Car, House, Vacation', () => {
      const childrenData = [{ name: 'Aarav' }, { name: 'Priya' }];
      
      expect(formatGoalTitle("Foreign Tour", childrenData)).toBe("Foreign Tour");
      expect(formatGoalTitle("Vacation", childrenData)).toBe("Vacation");
      expect(formatGoalTitle("Car", childrenData)).toBe("Car");
      expect(formatGoalTitle("House", childrenData)).toBe("House");

      const tourGoal = { category: 'lifestyle', goal_type: 'Foreign Tour', title: 'Foreign Tour' };
      expect(formatGoalTitle(tourGoal, childrenData)).toBe("Foreign Tour");

      const carGoal = { category: 'lifestyle', goal_type: 'Car', title: 'Car' };
      expect(formatGoalTitle(carGoal, childrenData)).toBe("Car");

      const houseGoal = { category: 'lifestyle', goal_type: 'House', goal_name: 'House' };
      expect(formatGoalTitle(houseGoal, childrenData)).toBe("House");
    });
  });

  describe('stripSalutation', () => {
    test('should strip Mr., Ms., Mrs., Dr., Prof., Shri, Smt, Master from name strings', () => {
      expect(stripSalutation('Mr. Rahul Sharma')).toBe('Rahul Sharma');
      expect(stripSalutation('Mr Rahul Sharma')).toBe('Rahul Sharma');
      expect(stripSalutation('Ms. Priya')).toBe('Priya');
      expect(stripSalutation('Mrs. Anjali Gupta')).toBe('Anjali Gupta');
      expect(stripSalutation('Dr. Sameer')).toBe('Sameer');
      expect(stripSalutation('Prof. Kumar')).toBe('Kumar');
      expect(stripSalutation('Shri Rajesh')).toBe('Rajesh');
      expect(stripSalutation('Smt. Sunita')).toBe('Sunita');
      expect(stripSalutation('Master Rohan')).toBe('Rohan');
    });

    test('should leave names without salutation unchanged', () => {
      expect(stripSalutation('Rahul Sharma')).toBe('Rahul Sharma');
      expect(stripSalutation('Valued Client')).toBe('Valued Client');
      expect(stripSalutation('')).toBe('');
    });
  });
});
