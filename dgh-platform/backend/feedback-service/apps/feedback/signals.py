"""
Signaux Django pour déclencher automatiquement le traitement des feedbacks
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Feedback
from .tasks import process_feedback_async
import logging

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Feedback)
def trigger_feedback_processing(sender, instance, created, **kwargs):
    """
    Signal déclenché après la création d'un nouveau feedback
    Lance automatiquement le traitement asynchrone
    
    Args:
        sender: Modèle Feedback
        instance: Instance du feedback créé
        created: True si c'est une création, False si c'est une mise à jour
        **kwargs: Arguments additionnels
    """
    if created and not instance.is_processed:
        logger.info(f"Nouveau feedback créé: {instance.feedback_id}, lancement du traitement asynchrone")
        
        # Déclenche la tâche Celery en arrière-plan
        task = process_feedback_async.delay(str(instance.feedback_id))
        
        logger.info(f"Tâche Celery lancée: {task.id} pour feedback {instance.feedback_id}")
    elif not created:
        logger.debug(f"Feedback {instance.feedback_id} mis à jour, pas de retraitement")