import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import WidgetGrid from './WidgetGrid';

const queryClient = new QueryClient();

describe('WidgetGrid', () => {
  it('renders the correct number of widgets', () => {
    const layouts = {
      lg: [
        { i: 'a', x: 0, y: 0, w: 1, h: 1 },
        { i: 'b', x: 1, y: 0, w: 1, h: 1 },
      ],
    };
    render(
      <QueryClientProvider client={queryClient}>
        <WidgetGrid layouts={layouts} setGridLayout={() => {}} />
      </QueryClientProvider>
    );
    const widgets = screen.getAllByRole('widget');
    expect(widgets).toHaveLength(2);
  });

  it('renders the correct widget content', () => {
    const layouts = {
      lg: [{ i: 'a', x: 0, y: 0, w: 1, h: 1 }],
    };
    render(
      <QueryClientProvider client={queryClient}>
        <WidgetGrid layouts={layouts} setGridLayout={() => {}} />
      </QueryClientProvider>
    );
    const widgetContent = screen.getByText('위젯 A');
    expect(widgetContent).toBeInTheDocument();
  });
});