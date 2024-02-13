using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ObstaclesGenerator : MonoBehaviour
{

    public GameObject[] obstacleTypes;
    private float distance = 10f;
    
    // Start is called before the first frame update
    void Start()
    {
        int randomObstacle = Random.Range(0, obstacleTypes.Length);
        
        GameObject obstacle = Instantiate(obstacleTypes[randomObstacle], transform.position, Quaternion.identity);
        
        float random = Random.Range(0, 3);
        
        obstacle.transform.position = random switch
        {
            0 => new Vector3(-2.25f, obstacle.transform.position.y, obstacle.transform.position.z - distance),
            1 => new Vector3(0, obstacle.transform.position.y, obstacle.transform.position.z - distance),
            2 => new Vector3(2.25f, obstacle.transform.position.y, obstacle.transform.position.z - distance),
            _ => obstacle.transform.position
        };
        
        obstacle.transform.parent = transform;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
