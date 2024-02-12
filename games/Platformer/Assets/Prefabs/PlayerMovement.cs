using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerMovement : MonoBehaviour
{
    
    public float speed = 5f;
    public float fast_speed = 20f;
    public float slow_speed = 10f;

    public float left_x = -2.25f;
    public float right_x = 2.25f;
    public float middle_x = 0f;
    private float current_x;
    public GameObject body;
    public bool isSpeedBoosted = false;
    
    
    void Start()
    {
        current_x = middle_x;
    }
    void Update()
    {

        if (isSpeedBoosted)
        {
            speed = fast_speed;
        }
        else
        {
            speed = slow_speed;
        }
        
        transform.position = new Vector3(transform.position.x, transform.position.y, transform.position.z + speed * Time.deltaTime);
        body.transform.rotation = Quaternion.Euler(0, -90, 0);
        body.transform.position = new Vector3(current_x, body.transform.position.y, body.transform.position.z);
        if(Input.GetKeyDown(KeyCode.RightArrow))
        {
            Right();
        }
        if(Input.GetKeyDown(KeyCode.LeftArrow))
        {
            Left();
        }
    }

    private void Right()
    {
        if (current_x == left_x)
        {
            //body.transform.position = new Vector3(middle_x, body.transform.position.y, body.transform.position.z);
            current_x = middle_x;
        } else if(current_x == middle_x)
        {
            //body.transform.position = new Vector3(right_x, body.transform.position.y, body.transform.position.z);
            current_x = right_x;
        }
    }

    private void Left()
    {
        if (current_x == right_x)
        {
            //body.transform.position = new Vector3(middle_x, body.transform.position.y, body.transform.position.z);
            current_x = middle_x;
        } else if(current_x == middle_x)
        {
            //body.transform.position = new Vector3(left_x, body.transform.position.y, body.transform.position.z);
            current_x = left_x;
        } 
    }
}