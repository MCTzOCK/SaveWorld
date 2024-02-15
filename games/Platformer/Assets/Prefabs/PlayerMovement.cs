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
    
    private Vector2 startTouchPosition, endTouchPosition;
    
    
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
        body.transform.position = new Vector3(current_x, body.transform.position.y, body.transform.position.z);
        if(Input.GetKeyDown(KeyCode.RightArrow))
        {
            Right();
        }
        if(Input.GetKeyDown(KeyCode.LeftArrow))
        {
            Left();
        }

        if (Input.GetKeyDown(KeyCode.Space))
        {
            Jump();
        }

        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
        {
            startTouchPosition = Input.GetTouch(0).position;
        }

        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended)
        {
            endTouchPosition = Input.GetTouch(0).position;
            
            if(endTouchPosition.x < startTouchPosition.x)
            {
                Left();
            }
            else if(endTouchPosition.x > startTouchPosition.x)
            {
                Right();
            }
            
            if(endTouchPosition.y > startTouchPosition.y)
            {
                Jump();
            }
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
    
    private bool IsGrounded()
    {
        return transform.GetChild(1).GetComponent<Rigidbody>().velocity.y == 0;
    }
    
    private void Jump()
    {
        if (IsGrounded())
        {
            transform.GetChild(1).GetComponent<Rigidbody>().velocity = new Vector3(0, 7f, 0);
        }
    }
}