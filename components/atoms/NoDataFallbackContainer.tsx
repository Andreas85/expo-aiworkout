import { ScrollView } from 'react-native';
import React from 'react';
import Container from './Container';
import NoDataSvg from '../svgs/NoDataSvg';

export default function NoDataFallbackContainer(props: { label?: string }) {
  const { label } = props;
  return (
    <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Container>
        <NoDataSvg label={label || 'No Data Found'} />
      </Container>
    </ScrollView>
  );
}
