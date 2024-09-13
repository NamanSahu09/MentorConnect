package com.example.mentorconnectfrontend

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp



@Preview(showBackground = true)
@Composable
fun LoginPage(){
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
            .padding(top = 75.dp),
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

        Spacer(modifier = Modifier.height(100.dp))

        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(R.string.continue_with_phone_no),
                style = TextStyle(
                    fontFamily = WorkSans,
                    fontWeight = FontWeight.Medium,
                    fontSize = 24.sp,
                    color = Color.White
                )
            )

            PhoneNumberField(stringResource(id = R.string.phone_number))
            PhoneNumberField(stringResource(id = R.string.otp_field))

            Button(onClick = { /*TODO*/ },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 20.dp, end = 20.dp, top = 16.dp)
                    .height(47.dp),
                colors = ButtonDefaults.buttonColors(Color.Black)
            ) {
                Text(
                    text = stringResource(R.string.get_otp),
                    style = TextStyle(
                        fontFamily = WorkSans,
                        fontWeight = FontWeight.Medium,
                        fontSize = 16.sp,
                        color = Color.White
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(50.dp))

        Text(
            text = "or",
            style = TextStyle(
                fontFamily = WorkSans,
                fontWeight = FontWeight.Medium,
                fontSize = 24.sp,
                color = Color.Black
            )
        )

        Spacer(modifier = Modifier.height(50.dp))

        SocialLoginButtons()
    }
}

@Composable
fun PhoneNumberField(hintText: String){
    var phoneNum by remember { mutableStateOf("") }

    TextField(
        value = phoneNum,
        onValueChange = { phoneNum = it},
        label = {
            Text(
                text = hintText,
                style = TextStyle(
                    fontFamily = WorkSans,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp,
                    color = Color(0xFFBCBCBC)
                )
            )
        },
        singleLine = true,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 20.dp, end = 20.dp, top = 20.dp)
            .clip(RoundedCornerShape(20.dp))
    )
}


@Composable
fun SocialLoginButtons(){
    Row (
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .width(250.dp)
            .height(50.dp)
            .background(Color.White),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ){
        IconButton(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .clip(CircleShape)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.facebook),
                contentDescription = "Facebook",
                tint = Color.Unspecified,
                modifier = Modifier.size(50.dp)
            )
        }

        IconButton(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .clip(CircleShape)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.google),
                contentDescription = "Facebook",
                tint = Color.Unspecified,
                modifier = Modifier.size(50.dp)
            )
        }

        IconButton(
            onClick = { /*TODO*/ },
            modifier = Modifier
                .clip(CircleShape)
        ) {
            Icon(
                painter = painterResource(id = R.drawable.linkedin),
                contentDescription = "Facebook",
                tint = Color.Unspecified,
                modifier = Modifier.size(50.dp)
            )
        }
    }
}

//change 1