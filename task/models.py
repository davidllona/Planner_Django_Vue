from django.db import models

# Create your models here.
class Period(models.Model):
     name=models.CharField(max_length=100)
     color=models.CharField(max_length=7, default="blue")
     start=models.DateField()
     end=models.DateField()
     task = models.ForeignKey("Task", null=True, related_name="period", on_delete=models.CASCADE)

     

class Task(models.Model):
     name=models.CharField(max_length=100, null=True)
     position=models.PositiveSmallIntegerField(null=False)
    #INSERT INTO ask_task (name,position) VALUES ('',0),('',1),('',2),('',3),('',4),('',5),('',6),('',7),('',8),('',9),('',10),('',11),('',12),('',13),('',14);
