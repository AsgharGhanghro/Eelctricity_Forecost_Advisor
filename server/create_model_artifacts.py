import pickle
import json
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential, save_model, load_model # type: ignore
from tensorflow.keras.layers import GRU, Dense, Dropout, Input # type: ignore
from sklearn.preprocessing import MinMaxScaler, StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

def create_sample_model():
    """Create a sample GRU model for electricity consumption prediction"""
    
    # Create sample data
    np.random.seed(42)
    n_samples = 10000
    sequence_length = 24  # 24 hours
    n_features = 10
    
    # Generate synthetic features
    features = {
        'temperature': np.random.normal(22, 5, n_samples),
        'humidity': np.random.normal(60, 10, n_samples),
        'hour': np.random.randint(0, 24, n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'is_weekend': np.random.binomial(1, 0.3, n_samples),
        'previous_consumption': np.random.exponential(50, n_samples),
        'weather_code': np.random.randint(1, 10, n_samples),
        'month': np.random.randint(1, 13, n_samples),
        'holiday': np.random.binomial(1, 0.1, n_samples),
        'time_since_peak': np.random.exponential(6, n_samples)
    }
    
    # Create sequences
    X = []
    y = []
    
    for i in range(n_samples - sequence_length):
        sequence = []
        for j in range(sequence_length):
            timestep = []
            for feature in features.values():
                timestep.append(feature[i + j])
            sequence.append(timestep)
        
        X.append(sequence)
        y.append(features['previous_consumption'][i + sequence_length])
    
    X = np.array(X)
    y = np.array(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Create and scale features
    scalers = {}
    feature_names = list(features.keys())
    
    # Scale each feature individually
    for i in range(n_features):
        scaler = MinMaxScaler()
        X_train_reshaped = X_train[:, :, i].reshape(-1, 1)
        X_test_reshaped = X_test[:, :, i].reshape(-1, 1)
        
        X_train_scaled = scaler.fit_transform(X_train_reshaped).reshape(
            X_train.shape[0], X_train.shape[1], 1
        )
        X_test_scaled = scaler.transform(X_test_reshaped).reshape(
            X_test.shape[0], X_test.shape[1], 1
        )
        
        if i == 0:
            X_train_final = X_train_scaled
            X_test_final = X_test_scaled
        else:
            X_train_final = np.concatenate([X_train_final, X_train_scaled], axis=2)
            X_test_final = np.concatenate([X_test_final, X_test_scaled], axis=2)
        
        scalers[feature_names[i]] = scaler
    
    # Scale target
    target_scaler = MinMaxScaler()
    y_train_scaled = target_scaler.fit_transform(y_train.reshape(-1, 1))
    y_test_scaled = target_scaler.transform(y_test.reshape(-1, 1))
    scalers['target'] = target_scaler
    
    # Build GRU model
    model = Sequential([
        Input(shape=(sequence_length, n_features)),
        GRU(128, return_sequences=True, dropout=0.2),
        GRU(64, return_sequences=False, dropout=0.2),
        Dense(32, activation='relu'),
        Dropout(0.2),
        Dense(16, activation='relu'),
        Dense(1, activation='linear')
    ])
    
    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='mse',
        metrics=['mae', 'mse']
    )
    
    # Train model
    history = model.fit(
        X_train_final, y_train_scaled,
        validation_data=(X_test_final, y_test_scaled),
        epochs=50,
        batch_size=32,
        verbose=1
    )
    
    # Save model
    model.save('gru_electricity_model.h5')
    
    # Save scalers
    with open('feature_scaler.pkl', 'wb') as f:
        pickle.dump(scalers, f)
    
    # Create metadata
    metadata = {
        'sequence_length': sequence_length,
        'n_features': n_features,
        'feature_names': feature_names,
        'model_type': 'GRU',
        'input_shape': (sequence_length, n_features),
        'output_shape': (1,),
        'training_date': pd.Timestamp.now().isoformat(),
        'version': '1.0.0',
        'metrics': {
            'final_loss': history.history['loss'][-1],
            'final_val_loss': history.history['val_loss'][-1],
            'final_mae': history.history['mae'][-1],
            'final_val_mae': history.history['val_mae'][-1]
        }
    }
    
    with open('model_metadata.pkl', 'wb') as f:
        pickle.dump(metadata, f)
    
    # Save training history
    history_df = pd.DataFrame(history.history)
    history_df.to_csv('training_history.csv', index=False)
    
    # Create complete model package
    complete_package = {
        'model': model,
        'scalers': scalers,
        'metadata': metadata,
        'history': history.history
    }
    
    with open('complete_model_package.pkl', 'wb') as f:
        pickle.dump(complete_package, f)
    
    print("✓ Model artifacts created successfully")
    print(f"Model saved as: gru_electricity_model.h5")
    print(f"Feature scalers saved as: feature_scaler.pkl")
    print(f"Metadata saved as: model_metadata.pkl")
    print(f"Training history saved as: training_history.csv")
    print(f"Complete package saved as: complete_model_package.pkl")
    
    return model, scalers, metadata

def verify_artifacts():
    """Verify that all artifacts can be loaded correctly"""
    try:
        # Load complete package
        with open('complete_model_package.pkl', 'rb') as f:
            package = pickle.load(f)
            print("✓ Complete package loaded successfully")
        
        # Load individual components
        model = load_model('gru_electricity_model.h5')
        print("✓ Model loaded successfully")
        
        with open('feature_scaler.pkl', 'rb') as f:
            scalers = pickle.load(f)
            print("✓ Feature scalers loaded successfully")
        
        with open('model_metadata.pkl', 'rb') as f:
            metadata = pickle.load(f)
            print("✓ Metadata loaded successfully")
        
        history_df = pd.read_csv('training_history.csv')
        print("✓ Training history loaded successfully")
        
        print("\nModel Summary:")
        print(f"Input Shape: {metadata['input_shape']}")
        print(f"Sequence Length: {metadata['sequence_length']}")
        print(f"Features: {metadata['feature_names']}")
        print(f"Model Type: {metadata['model_type']}")
        print(f"Version: {metadata['version']}")
        
        return True
        
    except Exception as e:
        print(f"✗ Error loading artifacts: {e}")
        return False

if __name__ == '__main__':
    print("Creating model artifacts...")
    create_sample_model()
    
    print("\nVerifying artifacts...")
    verify_artifacts()