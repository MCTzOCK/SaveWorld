using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class PlayerCollisions : MonoBehaviour
{
    
    private int collected_coins = 0;
    public TextMeshProUGUI coin_text;
    
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
            //save the loot to the top javascript window
            Application.ExternalEval("window.unityInstance.save('surfers', 'loot', " + (collected_coins + 1) + ")");
            collected_coins++;
            transform.parent.gameObject.GetComponent<PlayerMovement>().isSpeedBoosted = true;
            Destroy(other.gameObject);
            GetComponent<Rigidbody>().velocity = new Vector3(0, 0, 0);
            StartCoroutine(ResetSpeed());
            coin_text.text = "" + collected_coins;
        }
    }
    
    IEnumerator ResetSpeed()
    {
        yield return new WaitForSeconds(1.25f);
        transform.parent.gameObject.GetComponent<PlayerMovement>().isSpeedBoosted = false;
    }
}
