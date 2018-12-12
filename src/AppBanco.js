import React, {Component} from 'react';
import {ToastAndroid,Button, StyleSheet, Text, TextInput, Picker, View,
Switch, CheckBox, Slider} from 'react-native';
import TextInputMask from 'react-native-text-input-mask';
export default class AppBanco extends Component {

    constructor(props) {
        super(props);

        this.state = {
            correo:'correo@mail.algo',
            cuit: -1,
            moneda:1,
            capitalInicial:0,
            capitalFinal:0,
            slider : {
                dias: 10,
                minDistance: 10,
                maxDistance: 180
            },
            avisarPorMail: false,
            aceptoTyC: false,
            plazoFijo: '[[ RESULTADO DE LA OPERACION ]]',
            tasas: [25.0, 27.55, 30.0, 32.3, 35.0, 38.5],
            monto: 0.0
        };

        this.actualizarSlider = this.actualizarSlider.bind(this);

        this.hacerPlazoFijo = this.hacerPlazoFijo.bind(this);
        this.calcularTasa = this.calcularTasa.bind(this);
        this.intereses = this.intereses.bind(this);

        this.checkBoxCambiado = this.checkBoxCambiado.bind(this);
        this.switchCambiado = this.switchCambiado.bind(this);
    }

    actualizarSlider(val){
            this.setState(prevState => ({ slider: {...prevState.slider, dias: Math.floor(val)} }))
    }

    hacerPlazoFijo(){
        this.setState({ plazoFijo: 'Correo: '+this.state.correo+' \nCUIT: '+this.state.cuit+' \nDias: '+this.state.slider.dias+' \nMonto: '+ ((this.state.moneda==1)?'US$':'AR$') + ' '+ this.state.monto+' \nIntereses: '+ ((this.state.moneda==1)?'US$':'AR$') + ' '+ this.intereses()+' \nAvisar por mail: '+(this.state.avisarPorMail?'Si':'No') +' \nTerminos y Condiciones: '+(this.state.aceptoTyC?'Aceptados':'Faltan aceptar')})
    }

    intereses(){
        return this.state.monto*(Math.pow(1+this.calcularTasa()/100, this.state.slider.dias/360)-1);
    }

    calcularTasa() {
        if(this.state.slider.dias < 30 && this.state.monto <= 5000) return this.state.tasas[0];
        if(this.state.slider.dias >= 30 && this.state.monto <= 5000) return this.state.tasas[1];
        if(this.state.slider.dias < 30 && this.state.monto > 5000 && this.state.monto <= 99999) return this.state.tasas[2];
        if(this.state.slider.dias >= 30 && this.state.monto > 5000 && this.state.monto <= 99999) return this.state.tasas[3];
        if(this.state.slider.dias < 30 && this.state.monto > 99999) return this.state.tasas[4];
        if(this.state.slider.dias >= 30 && this.state.monto > 99999) return this.state.tasas[5];
        return 0.0;
    }

    checkBoxCambiado() {
        this.setState({ aceptoTyC: !this.state.aceptoTyC})
    }

    switchCambiado() {
        this.setState({ avisarPorMail: !this.state.avisarPorMail})
    }

render() {
    return (
        <View style={styles.container}>

            <Text>Correo Electronico</Text>

            <TextInput style={styles.textInputStyle} defaultValue={this.state.correo} onChangeText={(text) => this.state.correo = text}></TextInput>

            <Text>CUIT</Text>

            <TextInputMask
                defaultValue={"00-00000000-0"}
                refInput={ref => { this.input = ref }}
                onChangeText={(formatted, extracted) => {
                    //formatted: string con -
                    //extracted: numero extraido del string
                    this.setState({cuit: extracted})
              }}
              mask={"[00]-[00000000]-[0]"}
            />

            <Text>Moneda</Text>

            <Picker style={{width: 200}} selectedValue={this.state.moneda} onValueChange={(valor) => this.setState({moneda:valor})}>
                <Picker.Item label="Dolar" value="1" />
                <Picker.Item label="Pesos ARS" value="2" />
            </Picker>

            <Text>Monto</Text>

            <TextInput style={styles.textInputStyle} defaultValue={this.state.monto.toString()} keyboardType='numeric' onChangeText={(val) => this.state.monto = parseFloat(val)}></TextInput>

            <Text>Dias</Text>

            <Slider
                minimumValue={10}
                maximumValue={180}
                style={{width: 250}}
                value={this.state.slider.dias}
                onValueChange={val => this.actualizarSlider(val)}></Slider>

            <Text>{this.state.slider.dias} dias</Text>

            <Text>Avisar por mail:</Text>

            <Switch value={this.state.avisarPorMail} onChange={() => this.switchCambiado()}></Switch>

            <Text>Aceptar Terminos y Condiciones:</Text>

            <CheckBox title='Aceptar Terminos y Condiciones' style={styles.checkBox}
                                                             value={this.state.aceptoTyC}
                                                             onChange={() => this.checkBoxCambiado()} />

            <Button title="Hacer Plazo Fijo" color="#FF0000" onPress={this.hacerPlazoFijo}></Button>

            <Text>{this.state.plazoFijo}</Text>
        </View>
    );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});