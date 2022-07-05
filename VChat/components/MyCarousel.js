import React from 'react'
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Carousel } from '@ant-design/react-native'

const MyCarousel =(props)=>{

  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     selectedIndex: 2,
  //     autoplay: true,
  //   }
  // }
  // onHorizontalSelectedIndexChange = (index) => {
  //   /* tslint:disable: no-console */
  //   console.log('horizontal change to', index)
  //   this.setState({ selectedIndex: index })
  // }

  const items = [];
  for(let it of props.items){
    items.push(
      <View
      style={styles.containerHorizontal}>
      {it}
    </View>
    )
  }
  // console.log(props.items[0].height);
    return (
          <Carousel
            style={{width:'100%',height:props.height}}
            // selectedIndex={this.state.selectedIndex}
            autoplay
            infinite
            // afterChange={this.onHorizontalSelectedIndexChange}
            // ref={(ref) => (this.carousel = ref)}
            >
            {items}
          </Carousel>
    )
  }


const styles = StyleSheet.create({
  containerHorizontal: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
})
export default MyCarousel;