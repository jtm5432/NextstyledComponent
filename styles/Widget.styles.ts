import styled from 'styled-components';

const Widget = styled.div`
    width: 100%;
    height: 100%;
    background: white;
    overflow-x: auto;
    overflow-y: hidden;
`;

const WidgetCoral = styled(Widget)`
    background: lightcoral;
`;

const WidgetGreen = styled(Widget)`
    background: lightgreen;
`;

const Styled = {
    Widget :Widget,
    WidgetCoral: WidgetCoral,
    WidgetGreen: WidgetGreen    
}

export default Styled;