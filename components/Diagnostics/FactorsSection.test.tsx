import React from 'react';
import { render } from '@testing-library/react-native';
import FactorsSection from '@/components/Diagnostics/FactorsSection';

describe('FactorsSection Component', () => {
  it('renders the empty state message when no factors are present', () => {
    const { getByText } = render(<FactorsSection data={{}} />);
    
    // Check for the specific fallback text you added
    expect(getByText('No specific risk factors reported for this period.')).toBeTruthy();
  });

  it('renders the "Factors" header and cards when data is present', () => {
    const mockData = {
      chest_pain: true,
      shortness_breath: true
    };

    const { getByText, getAllByText } = render(<FactorsSection data={mockData} />);

    // Check Header
    expect(getByText('Factors')).toBeTruthy();

    // Check that both cards are rendered
    expect(getByText('Chest Pain')).toBeTruthy();
    expect(getByText('Shortness of Breath')).toBeTruthy();
    
    // Check that "Present" appears twice (once for each card)
    expect(getAllByText('Present')).toHaveLength(2);
  });
});