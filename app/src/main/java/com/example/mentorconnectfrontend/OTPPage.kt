package com.example.mentorconnectfrontend

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Preview(showBackground = true)
@Composable
fun OTPPage(){
    Box(modifier = Modifier
        .fillMaxSize()
        .background(
            brush = Brush.verticalGradient(
                colors = listOf(Color(0xFF235391), Color(0xFF2675B9), Color(0xFF2BAFFC))
            )
        ))

    Column (
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 97.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ){
        Text(
            text = stringResource(R.string.application_name),
            color = Color.White,
            style = TextStyle(
                fontFamily = Cabin,
                fontSize = 48.sp,
                fontWeight = FontWeight.SemiBold
            )
        )
        Text(
            text = stringResource(R.string.tagline),
            color = Color.White,
            style = TextStyle(
                fontSize = 20.sp,
                fontWeight = FontWeight.Medium,
                fontFamily = WorkSans
            )
        )

        Spacer(modifier = Modifier.height(150.dp))

        Text(
            text = stringResource(R.string.enter_otp),
            style = TextStyle(
                fontFamily = WorkSans,
                fontWeight = FontWeight.Medium,
                fontSize = 24.sp,
                color = Color.White
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp)
        )

        Text(
            text = stringResource(R.string.otp_instr) + numCopy,
            style = TextStyle(
                fontFamily = WorkSans,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp,
                color = Color.White
            ),
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp)
        )

        OtpRow(modifier = Modifier.padding(top = 13.dp, start = 20.dp, end = 20.dp))


        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 10.dp)
        ) {
            TextButton(
                onClick = { /*TODO*/ }
            ) {
                Text(
                    text = stringResource(R.string.resend_otp),
                    style = TextStyle(
                        fontFamily = WorkSans,
                        fontWeight = FontWeight.Normal,
                        fontSize = 16.sp,
                        color = Color.White,
                        textDecoration = TextDecoration.Underline
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(240.dp))

        ButtonGroup()
    }
}

@Composable
fun OtpRow(modifier: Modifier){
    Row (
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ){
        repeat(6){
            OtpInputField()
        }
    }
}


@Composable
fun OtpInputField(){
    var otp by remember {
        mutableStateOf("")
    }

    TextField(
        value = otp,
        onValueChange = { newVal ->
                        if(newVal.length <= 1 && newVal.all { it.isDigit() }){
                            otp = newVal
                        }
        },
        modifier = Modifier
            .width(50.dp)
            .height(50.dp)
            .clip(RoundedCornerShape(10.dp)),
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
        )

}

@Composable
fun ButtonGroup(){
    Row (
        modifier = Modifier
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ){
        Button(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .padding(start = 20.dp, end = 20.dp, top = 16.dp)
                .height(47.dp)
                .width(70.dp),
            colors = ButtonDefaults.buttonColors(Color.Black)
        ) {
            Text(
                text = "<-",
                style = TextStyle(
                    fontFamily = WorkSans,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp,
                    color = Color.White
                )
            )
        }

        Button(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .padding(start = 20.dp, end = 20.dp, top = 16.dp)
                .height(47.dp)
                .width(115.dp),
            colors = ButtonDefaults.buttonColors(Color.Black)
        ) {
            Text(
                text = "Next  ->",
                style = TextStyle(
                    fontFamily = WorkSans,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp,
                    color = Color.White
                )
            )
        }
    }
}