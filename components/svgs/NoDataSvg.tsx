import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { Text } from '../Themed';
import Container from '../atoms/Container';
import { tailwind } from '@/utils/tailwind';

interface IProps {
  width?: number;
  height?: number;
  label?: string;
  message?: string;
}

function NoDataSvg(props: IProps) {
  const { width, height, label, message } = props;
  return (
    <>
      <Container style={tailwind('gap-y-4')}>
        <Svg
          style={tailwind('self-center')}
          {...props}
          width={width ?? '43'}
          height={height ?? 55}
          viewBox="0 0 43 55"
          fill="none">
          <Path
            d="M10.38 14.051a2.36 2.36 0 002.377-2.384 2.377 2.377 0 00-2.378-2.385c-1.278 0-2.377 1.103-2.377 2.385 0 1.307 1.099 2.384 2.377 2.384zm0 7.846a2.377 2.377 0 002.377-2.384c0-1.334-1.048-2.36-2.378-2.36-1.303 0-2.377 1.052-2.377 2.36a2.393 2.393 0 002.377 2.384zm0 8.205a2.376 2.376 0 002.377-2.384 2.36 2.36 0 00-2.378-2.385c-1.278 0-2.377 1.077-2.377 2.385 0 1.282 1.099 2.384 2.377 2.384zm7.209-16.82h15.824c.87 0 1.585-.718 1.585-1.615 0-.872-.716-1.59-1.585-1.59H17.59c-.87 0-1.585.718-1.585 1.59 0 .897.715 1.615 1.585 1.615zm0 7.82h15.824c.895 0 1.585-.692 1.585-1.59 0-.897-.69-1.589-1.585-1.589H17.59c-.895 0-1.585.692-1.585 1.59 0 .897.69 1.59 1.585 1.59zm0 8.206h15.824c.87 0 1.585-.718 1.585-1.59 0-.872-.69-1.59-1.585-1.59H17.59c-.895 0-1.585.718-1.585 1.59 0 .872.715 1.59 1.585 1.59zM0 46.948c0 5.36 2.633 8.026 7.925 8.026h27.15c5.292 0 7.925-2.666 7.925-8.025V8.05C43 2.718 40.367 0 35.075 0H7.925C2.633 0 0 2.718 0 8.051V46.95zm4.116-.076V8.128c0-2.564 1.355-4 4.014-4h26.74c2.659 0 4.014 1.436 4.014 4v38.744c0 2.564-1.355 3.974-4.014 3.974H8.13c-2.66 0-4.014-1.41-4.014-3.974z"
            fill="#A27DE1"
          />
        </Svg>
        <Container style={tailwind('gap-y-4')}>
          <Text>{label}</Text>
          <Text>{message}</Text>
        </Container>
      </Container>
    </>
  );
}

export default NoDataSvg;
