using System.Collections;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using TMPro;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerCollisions : MonoBehaviour
{
    
    private int collected_coins = 0;
    public TextMeshProUGUI coin_text;
    [DllImport("__Internal")]
    private static extern int GetHighScore();
    [DllImport("__Internal")]
    private static extern void SetHighScore(int score);
    
    void Start()
    {
        
    }

    void Update()
    {
        
    }
    
    
    private void OnCollisionEnter(Collision other)
    {
        if (other.gameObject.CompareTag("Loot"))
        {
            if (collected_coins + 1 > GetHighScore())
            {
                SetHighScore(collected_coins + 1);
                print("New High Score: " + GetHighScore());
            }

            collected_coins++;
            transform.parent.gameObject.GetComponent<PlayerMovement>().isSpeedBoosted = true;
            //transform.parent.position = new Vector3(transform.parent.position.x, transform.parent.position.y, transform.parent.position.z + .1f * Time.deltaTime);
            //transform.position = new Vector3(transform.position.x, transform.position.y, transform.position.z + Time.deltaTime);
            //transform.gameObject.GetComponent<Rigidbody>().velocity = new Vector3(0, 0, .2f);
            // remove velocity
            //transform.gameObject.GetComponent<Rigidbody>().velocity = new Vector3(0, 0, 0);
            Destroy(other.gameObject);
            GetComponent<Rigidbody>().velocity = new Vector3(0, 0, 0);
            StartCoroutine(ResetSpeed());
            coin_text.text = "" + collected_coins;
        }

        if (other.gameObject.CompareTag("Obstacle"))
        {
            SceneManager.LoadScene("GameOver");
        }
    }
    
    IEnumerator ResetSpeed()
    {
        yield return new WaitForSeconds(1.25f);
        transform.parent.gameObject.GetComponent<PlayerMovement>().isSpeedBoosted = false;
    }
}
