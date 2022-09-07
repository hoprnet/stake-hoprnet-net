import styled from "@emotion/styled";

const H2 = styled.h2`
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 50px;
  line-height: 1.25;


  letter-spacing: 0.5px;

  color: #414141;
  margin-bottom: 32px;
  
  &.typography--center{
    text-align: center;
  }
  &.typography--fullWidth{
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 36px;
  }
  @media (max-width: 330px) {
    font-size: 28px;
  }
`

const H5 = styled.h5`
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 28px;
  line-height: 25px;
  
  text-align: center;
  letter-spacing: 0.15px;
  
  color: #414141;
`

const H6 = styled.h6`
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 700;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.5;
  
  text-align: center;
  letter-spacing: 0.15px;
  color: #414141;
  margin: 0;
  &.typography--white {
    color: #fff
  }
  &.mb32 {
    margin-bottom: 32px;
  }
`

const PlainText = styled.div`
  font-family: 'Source Code Pro';
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.6;
  /* or 144% */

  text-align: left;
  
  &.typography--center {
    text-align: center;
  }
  letter-spacing: 0.25px;

  color: #414141;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    font-size: 16px;
  }
  @media (max-width: 330px) {
    font-size: 14px;
  }

  &.mb80 {
    margin-bottom: 80px;
  }
`


function Typography(props) {

    if (props.type==="h2") {
        return (
            <H2 className={`Typography--h2 ${props.className} ${props.center ? 'typography--center' : ''} ${props.fullWidth ? 'typography--fullWidth' : ''}`} >
                {props.children}
            </H2>
        );
    } else if (props.type==="h5") {
        return (
            <H5 className={`Typography--h5 ${props.className} ${props.center ? 'typography--center' : ''} ${props.fullWidth ? 'typography--fullWidth' : ''}`} >
                {props.children}
            </H5>
        );
    } else if (props.type==="h6") {
        return (
            <H6 className={`Typography--h5 ${props.className} ${props.white ? 'typography--white' : ''}`} >
                {props.children}
            </H6>
        );
    }

    return (
        <PlainText
           className={`Typography--PlainText ${props.className} ${props.center ? 'typography--center' : ''}`}
        >
            {props.children}
        </PlainText>
    );

}

export default Typography;

Typography.defaultProps = {
    className: '',
}
